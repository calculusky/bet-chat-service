import { Request } from 'express';
import { User } from '@prisma/client';


export type LoginInput = {
    email: string;
    password: string;
}

export interface DataStoredInToken {
    id: number;
    email: string;
}

export type CreateUserInput = {
    firstName: string
    lastName: string
    email: string
    password: string
    interestId: number
}


export interface RequestWithCreateUser extends Request {
    createUser: CreateUserInput
}

export interface RequestWithUser extends Request {
    user: User
}
