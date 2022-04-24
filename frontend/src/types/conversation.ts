import { ID } from './misc';

export interface Message {
    userId: ID,
    message: string,
}

export interface Conversation {
    convoId: ID,
    messages: Message[]
}
