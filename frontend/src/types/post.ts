import { ID } from './misc';

export interface PostType {
    postId: ID,
    authorId?: ID,
    title: string,
    caption: string,
    comments: Comment[],
    topic: string,
    img: string,
    anonymous: boolean,
    date: string,
    likes: string[],
    loves: string[],
    dislikes: string[],
}

export interface Comment {
    userId: string,
    comment: string,
}
