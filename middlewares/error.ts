import { NextFunction, Request, Response } from "express";
import { HttpException } from '../exceptions/httpException';


const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof SyntaxError) {
            return res.status(400).json({
                message: 'Invalid body payload format',
            });
        }

        if (!error.status) {
            error.message = 'Internal server error';
            error.status = 500
        }

        const status = error.status;
        const message = error.message;
        return res.status(status).json({ errors: { status, message } })

    } catch (error) {
        next(error)
    }
}



export default errorMiddleware;