import { GeneralResponseType, UserResponseType } from '../types/api'
import client from './httpClient'

export const updateUsername = async (newUsername: string): Promise<UserResponseType> => {
    // TODO: finish
    const response = await client.post('/user/update', { newUsername }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 200) {
        return response.data
    } if (response.status === 302) {
        return { ...response.data, error: 302 }
    }
    return { ...response.data, error: -1 }
}

export const updateEmail = async (newEmail: string): Promise<UserResponseType> => {
    // TODO: finish
    const response = await client.post('/user/login', { newEmail }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 200) {
        return response.data
    } if (response.status === 302) {
        return { ...response.data, error: 302 }
    }
    return { ...response.data, error: -1 }
}

export const updatePassword = async (newPassword: string): Promise<UserResponseType> => {
    // TODO: finish
    const response = await client.post('/user/login', { newPassword }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 200) {
        return response.data
    } if (response.status === 302) {
        return { ...response.data, error: 302 }
    }
    return { ...response.data, error: -1 }
}
