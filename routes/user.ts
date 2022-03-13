import { Router } from 'express';
import UserController from '../controllers/user';
import AuthMiddleware from '../middlewares/auth';


class UserRoute {
    public userController = new UserController();
    public authMiddleware = new AuthMiddleware();
    router = Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.get('/user/user-details', this.authMiddleware.authenticateUser, this.userController.getUserDetails);

    }
}


module.exports = UserRoute;