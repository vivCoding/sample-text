import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event'
import { FetcherResponseType, GeneralResponseType } from '../../types/api'
import { UserResponseType } from '../../types/api/user'
import client from '../httpClient'

export const createUser = async (username: string, email: string, password: string): Promise<GeneralResponseType> => {
    const response = await client.post(
        '/user/createaccount',
        { username, email, password },
    ).catch(() => ({ status: 404, data: undefined }))
    const error = {
        email: '', username: '', password: '', server: '',
    }
    if (response.status !== 200) {
        error.server = 'There was an error signing you up. Try again later!'
        return { success: false, data: error, error: 404 }
    }
    const data = response.data as GeneralResponseType
    if (data.error) {
        if (data.error === 1 || data.error === 2 || data.error === 6) {
            error.username = data.errorMessage ?? ''
        } else if (data.error === 3 || data.error === 7) {
            error.email = data.errorMessage ?? ''
        } else if (data.error === 4 || data.error === 5) {
            error.password = data.errorMessage ?? ''
        } else {
            error.server = 'There was an error signing you up. Try again later!'
        }
        return { ...data, data: error }
    }
    return data
}

export const loginUser = async (loginField: string, password: string): Promise<UserResponseType> => {
    const response = await client.post(
        '/user/login',
        { loginField, password },
    ).catch(() => ({ status: 404, data: undefined, error: 404 }))
    if (response.status !== 200) {
        return { ...response.data, errorMessage: 'There was an error logging you in. Try again later!' }
    }
    return response.data as UserResponseType
}

export const logoutUser = async (): Promise<GeneralResponseType> => {
    const response = await client.post('/user/logout').catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    return { success: response.status === 200, error: response.status }
}

export const getUser = async (): Promise<UserResponseType> => {
    const response = await client.post('/user/getuser').catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    if (response.status !== 200) {
        return { success: false, error: 401 }
    }
    return response.data as UserResponseType
}

export const deleteUser = async (password: string): Promise<GeneralResponseType> => {
    const response = await client.post('/user/deleteuser', { password }).catch(() => (
        { status: 404, data: { success: false, error: 404, errorMessage: 'There was an error deleting your account. Please try again later!' } }))
    return response.data as GeneralResponseType
}

export const userFetcher = (url: string, username: string): Promise<FetcherResponseType> => (
    client.post(url, { username }).then((res) => ({ status: res.status, data: res.data }))
)
