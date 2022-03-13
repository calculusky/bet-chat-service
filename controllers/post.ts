import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../interfaces/auth';
import { CreatePostInput } from '../interfaces/post';
import PostService from '../services/post';



class PostController {

    public postService = new PostService;

    //user creates a post
    public createPost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const user: User = req.user;
        const postPayload: CreatePostInput = { ...req.body, userId: user.id }

        try {
            const createdPost = await this.postService.createPost(postPayload)
            res.status(201).json({ data: createdPost });

        } catch (error) {
            next(error);
        }
    }

    //user get other users posts
    public getOtherPosts = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const user: User = req.user;
        try {
            const otherPosts = await this.postService.findOtherPosts(user.id);
            res.json({ data: otherPosts });

        } catch (error) {
            next(error);
        }

    }

}

export default PostController;