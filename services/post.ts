import { Post, PrismaClient, User } from '@prisma/client';
import { HttpException } from '../exceptions/httpException';
import { CreatePostInput } from '../interfaces/post';

class PostService {

    public post = new PrismaClient().post;

    public createPost = async (postPayload: CreatePostInput): Promise<Post> => {
        const createdPost: Post = await this.post.create({ data: postPayload });
        return createdPost;
    }

    public findOtherPosts = async (userId: number): Promise<Post[]> => {
        const posts: Post[] = await this.post.findMany({
            where: {
                NOT: {
                    userId: userId
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return posts;
    }

}

export default PostService;