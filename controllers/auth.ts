import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, LoginInput, RequestWithCreateUser } from '../interfaces/auth';
import AuthService from '../services/auth';


class AuthController {

    public authService = new AuthService();

    public signup = async (req: RequestWithCreateUser, res: Response, next: NextFunction) => {
        const userData: CreateUserInput = req.createUser;
        try {

            const createdUser = await this.authService.signup(userData);

            res.status(201).json({ data: createdUser })

        } catch (error) {
            next(error)
        }
    }


    public login = async (req: Request, res: Response, next: NextFunction) => {
        const userInput: LoginInput = req.body;
        try {

            const token = await this.authService.loginUser(userInput);

            res.status(201).json({ success: true, token: token })

        } catch (error) {
            next(error)
        }
    }

}

export default AuthController