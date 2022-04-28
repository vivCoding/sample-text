import { ID } from './misc';

export interface MessageType {
    authorId: ID,
    message: string,
    timestamp: string,
}

export interface ConversationType {
    convoId: ID,
    user1: ID,
    user2: ID,
    messages: MessageType[]
}
