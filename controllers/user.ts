import { PrismaClient, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../interfaces/auth';
import UserService from '../services/user';


class UserController {

    public userService = new UserService();

    public getUserDetails = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const user: User = req.user;

        try {
            const userData = await this.userService.getUserData({ id: user.id })
            res.json({ data: userData });

        } catch (error) {
            next(error);
        }
    }

}

export default UserController;