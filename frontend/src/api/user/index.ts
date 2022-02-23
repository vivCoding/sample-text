import { GeneralResponseType, UserResponseType } from '../../types/api'
import client from '../httpClient'

// TODO: add error message to backend
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

// TODO: rename to loginField on backend side
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
