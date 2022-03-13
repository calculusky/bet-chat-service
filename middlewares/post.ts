import { NextFunction, Response } from "express";
import { CreatePostInput } from "../interfaces/post";
import { isEmail, isAlpha, isAlphanumeric, normalizeEmail } from 'validator';
import { HttpException } from '../exceptions/httpException';
import { RequestWithUser } from "../interfaces/auth";



class PostMiddleware {

    public validateCreatePostInput = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const postInput: CreatePostInput = req.body;

        try {
            //validating title
            if (!postInput.title) throw new HttpException(400, 'Title is required');
            if (typeof postInput.title != 'string') throw new HttpException(400, 'Invalid Title format');

            //validating content
            if (!postInput.content) throw new HttpException(400, 'Content is required');
            if (typeof postInput.content != 'string') throw new HttpException(400, 'Invalid Content format');

            const sanitizedData = {
                title: postInput.title.trim(),
                content: postInput.content.trim()
            }

            //update request body;
            req.body = sanitizedData;
            return next();

        } catch (error) {
            next(error);
        }

    }
}


export default PostMiddleware