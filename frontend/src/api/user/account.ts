import { AccountResponseType } from '../../types/api'
import client from '../httpClient'

export const updateUsername = async (newUsername: string): Promise<AccountResponseType> => {
    const response = await client.post('/user/updateusername', { newUsername })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your username. Please try again later!' }
    }
    return response.data as AccountResponseType
}

export const updateEmail = async (newEmail: string): Promise<AccountResponseType> => {
    const response = await client.post('/user/updateemail', { newEmail })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your email. Please try again later!' }
    }
    return response.data as AccountResponseType
}

export const updatePassword = async (newPassword: string): Promise<AccountResponseType> => {
    const response = await client.post('/user/updatepassword', { newPassword })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your password. Please try again later!' }
    }
    return response.data as AccountResponseType
}
