import { ID } from './misc';

export interface PostType {
    postId: ID,
    authorId: ID,
    title: string,
    caption: string,
    img: string,
}
