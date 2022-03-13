import { Router } from 'express';
import AuthController from '../controllers/auth'
import AuthMiddleware from '../middlewares/auth';


class AuthRoute {
    public authController = new AuthController();
    public authMiddleware = new AuthMiddleware();
    router = Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.post('/auth/signup', this.authMiddleware.validateSignup, this.authController.signup);
        this.router.post('/auth/login', this.authMiddleware.validateLogin, this.authController.login);
    }
}


module.exports = AuthRoute;