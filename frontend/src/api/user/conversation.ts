import client from '../client'
import { ID } from '../../types/misc'
import { ConversationResponseType } from '../../types/api/conversation'
import { MessageType } from '../../types/conversation'
import { GeneralResponseType } from '../../types/api'

export const getConversation = async (conversationId: string): Promise<ConversationResponseType> => {
    const response = await client.post('/user/getconversation', { conversation_id: conversationId }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'Could not get conversation! User no longer exists!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    if (resData && resData.data) {
        const messages: MessageType[] = []
        resData.data.messages.forEach((message: any) => {
            messages.push({
                authorId: message.author_id,
                message: message.message,
                timestamp: message.timestamp,
            })
        })
        resData.data.messages = messages
        resData.data.convoId = resData.data.convo_id
    }
    return resData as ConversationResponseType
}

export const getConversationByParticipants = async (userId1: ID, userId2: ID): Promise<ConversationResponseType> => {
    const response = await client.post('/user/getconversationbyparticipants', { user1: userId1, user2: userId2 }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'Could not get conversation!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    if (resData && resData.data) {
        const messages: MessageType[] = []
        resData.data.messages.forEach((message: any) => {
            messages.push({
                authorId: message.author_id,
                message: message.message,
                timestamp: message.timestamp,
            })
        })
        resData.data.messages = messages
        resData.data.convoId = resData.data.convo_id
    }
    return resData as ConversationResponseType
}

export const createConversation = async (recipient: ID): Promise<GeneralResponseType> => {
    const response = await client.post('/user/createconversation', { recipient }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'Could not create conversation! User no longer exists!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    if (resData && resData.data) {
        resData.convoId = resData.convo_id
    }
    return resData as GeneralResponseType
}

export const sendMessage = async (conversationId: ID, message: string): Promise<GeneralResponseType> => {
    const response = await client.post('/user/sendprivatemessage', { conversation_id: conversationId, message }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'Could not send message! Conversation no longer found!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}
