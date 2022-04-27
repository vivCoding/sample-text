import { BaseResponseType } from '.';
import { ConversationType } from '../conversation';

export interface ConversationResponseType extends BaseResponseType {
    data?: ConversationType
}
