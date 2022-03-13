import { Request, Response, NextFunction } from 'express';
import { isEmail, isAlpha, isAlphanumeric, normalizeEmail } from 'validator';
import { HttpException } from '../exceptions/httpException';
import { DataStoredInToken, LoginInput, RequestWithUser, RequestWithCreateUser, CreateUserInput } from '../interfaces/auth';
import { formatName } from '../utilities/helper';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../services/auth';
import { User } from '@prisma/client';
import UserService from '../services/user';



class AuthMiddleware {

    public authService = new AuthService();
    public userService = new UserService();
    public secretKey = process.env.JWT_SECRET

    public validateSignup = async (req: RequestWithCreateUser, res: Response, next: NextFunction) => {
        const userData: CreateUserInput = req.body;
        try {

            //validating firstName
            if (!userData.firstName) throw new HttpException(400, 'First name is required');
            if (!isAlpha(userData.firstName)) throw new HttpException(400, 'first name must be letters');

            //validating lastName
            if (!userData.lastName) throw new HttpException(400, 'Last name is required');
            if (!isAlpha(userData.lastName)) throw new HttpException(400, 'last name must be letters');


            //validating email
            if (!userData.email) throw new HttpException(400, 'Email is required');
            if (!isEmail(userData.email)) throw new HttpException(400, 'Invalid email address');

            //validating password
            if (!userData.password) throw new HttpException(400, 'Password is required');
            if (userData.password.length < 8 || !isAlphanumeric(userData.password)) throw new HttpException(400, 'password must contain letters or numbers with minimum of 8 characters');

            //validating interestId
            if (!userData.interestId) throw new HttpException(400, 'Interest ID is required');
            if (isNaN(userData.interestId)) throw new HttpException(400, 'Interest ID must be numeric');


            const data = {
                firstName: formatName(userData.firstName.trim()),
                lastName: formatName(userData.lastName.trim()),
                email: normalizeEmail(userData.email),
                password: bcrypt.hashSync(userData.password, 14),
                interestId: userData.interestId
            }

            req.createUser = data;

            return next();

        } catch (error) {
            next(error)
        }
    }

    //validate login input
    public validateLogin = (req: Request, res: Response, next: NextFunction) => {
        const userInput: LoginInput = req.body;

        try {

            if (!userInput.email || !isEmail(userInput.email)) throw new HttpException(400, 'Wrong email or password');

            if (!userInput.password || !isAlphanumeric(userInput.password)) throw new HttpException(400, 'Wrong email or password');

            return next();

        } catch (error) {
            next(error)
        }
    }

    public authenticateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {

        try {

            const Authorization = req.header('Authorization');

            if (!Authorization) throw new HttpException(401, 'Unauthorized! Please login');

            const decoded = jwt.verify(Authorization, this.secretKey) as DataStoredInToken;

            if (!decoded) throw new HttpException(400, 'Wrong authentication token');

            const userId = decoded.id;

            const user: User = await this.userService.findUser({ id: userId });

            if (!user) throw new HttpException(400, 'Wrong authentication token');

            req.user = user;

            return next();

        } catch (error) {
            next(new HttpException(401, 'Wrong authentication token'));
        }
    }
}

export default AuthMiddleware;