import { BaseResponseType } from '.';
import { TopicType } from '../topic'

export interface TopicResponseType extends BaseResponseType {
    data?: TopicType
}
