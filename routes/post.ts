import { Router } from 'express';
import PostController from '../controllers/post';
import AuthMiddleware from '../middlewares/auth';
import PostMiddleware from '../middlewares/post';

class PostRoute {
    public postController = new PostController();
    public authMiddleware = new AuthMiddleware();
    public postMiddleware = new PostMiddleware();
    router = Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.post('/post/create-post', this.authMiddleware.authenticateUser, this.postMiddleware.validateCreatePostInput, this.postController.createPost);
        this.router.get('/post/other-posts', this.authMiddleware.authenticateUser, this.postController.getOtherPosts);
    }
}


module.exports = PostRoute;