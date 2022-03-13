import { CreateUserInput, DataStoredInToken, LoginInput } from '../interfaces/auth';
import { PrismaClient, Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { HttpException } from '../exceptions/httpException';
import UserService from './user';
import jwt from 'jsonwebtoken';




class AuthService extends UserService {

    public secretKey = process.env.JWT_SECRET;
    public prisma = new PrismaClient();

    //signup
    public signup = async (userData: CreateUserInput) => {
        const existingUser = await this.findUser({ email: userData.email });
        if (existingUser) throw new HttpException(409, 'Account already exists');

        const getInterest = await this.findInterest({ id: userData.interestId });
        if (!getInterest) throw new HttpException(404, 'Interest does not exist');

        return await this.prisma.user.create({
            data: userData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                interest: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }


    // login
    public loginUser = async (userInput: LoginInput) => {
        const user: User = await this.findUser({ email: userInput.email });
        if (!user) throw new HttpException(404, 'Account does not exist');

        const isPasswordMatching: boolean = await bcrypt.compare(userInput.password, user.password);
        if (!isPasswordMatching) throw new HttpException(409, "Wrong email or password");

        return this.createToken(user);

    }


    //find interest
    public findInterest = async (where: Prisma.InterestWhereUniqueInput) => {
        return this.prisma.interest.findUnique({ where });
    }

    //create authentication token
    private createToken = (user: User): string => {
        const dataStoredInToken: DataStoredInToken = { id: user.id, email: user.email };
        const expiresIn: number = 60 * 60 * 24;
        return jwt.sign(dataStoredInToken, this.secretKey, { expiresIn });
    }
}

export default AuthService;

