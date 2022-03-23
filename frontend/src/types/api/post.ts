import { BaseResponseType } from '.';
import { PostType } from '../post'

export interface PostResponseType extends BaseResponseType {
    data?: PostType
}
