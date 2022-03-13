import { PrismaClient, Prisma, User } from '@prisma/client';
import { HttpException } from '../exceptions/httpException';


class UserService {

    public user = new PrismaClient().user;

    //find a unique user
    public findUser = async (where: Prisma.UserWhereUniqueInput) => {
        const user: User = await this.user.findUnique({ where });
        return user;
    }

    public getUserData = async (where: Prisma.UserWhereUniqueInput) => {
        const user = await this.user.findUnique({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                interest: {
                    select: { name: true }
                }
            }
        });

        if (!user) throw new HttpException(404, 'User could not be found');
        return user;
    }

}

export default UserService;