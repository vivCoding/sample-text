import { GeneralResponseType } from '../../types/api'
import { TopicResponseType } from '../../types/api/topic'
import client from '../client'

export const getTopic = async (topicName: string): Promise<TopicResponseType> => {
    const response = await client.post('/topic/findtopic', { topic_name: topicName }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }

    const resData = response.data as any
    if (resData.data) {
        resData.data.topic = resData.data.topic_name
    }
    return response.data as TopicResponseType
}

export const followTopic = async (topicName: string): Promise<GeneralResponseType> => {
    const response = await client.post('/user/followtopic', { topic_name: topicName }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}

export const unfollowTopic = async (topicName: string): Promise<GeneralResponseType> => {
    const response = await client.post('/user/unfollowtopic', { topic_name: topicName }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}
