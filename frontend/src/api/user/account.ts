import { AccountResponseType } from '../../types/api/user'
import client from '../client'

export const getAccount = async (): Promise<AccountResponseType> => {
    const response = await client.post('/user/getaccount').catch(() => ({ status: 404, data: undefined }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue getting your account. Please try again later!' }
    }
    return response.data as AccountResponseType
}

export const updateUsername = async (newUsername: string): Promise<AccountResponseType> => {
    const response = await client.post('/user/editusername', { newUsername })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your username. Please try again later!' }
    }
    return response.data as AccountResponseType
}

export const updateEmail = async (newEmail: string): Promise<AccountResponseType> => {
    const response = await client.post('/user/editemail', { newEmail })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your email. Please try again later!' }
    }
    return response.data as AccountResponseType
}

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<AccountResponseType> => {
    const response = await client.post('/user/editpassword', { oldPassword, newPassword })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your password. Please try again later!' }
    }
    return response.data as AccountResponseType
}
