import { ID } from './misc';

export interface PostType {
    postId: ID,
    authorId?: ID,
    title: string,
    likes: string[],
    caption: string,
    comments: Comment[],
    topic: string,
    img: string,
    anonymous: boolean,
    date: string,
}

export interface Comment {
    userId: string,
    comment: string,
}
