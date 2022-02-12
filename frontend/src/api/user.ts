import ResponseType from '../types/api'
import client from './httpClient'

export const createUser = async (username: string, email: string, password: string): Promise<ResponseType> => {
    const response = await client.post('/user/createaccount', { username, email, password })
    const error = {
        email: '', username: '', password: '', server: '',
    }
    if (response.status !== 200) {
        error.server = 'There was an error signing you up. Try again later!'
        return { success: false, data: error, error: -1 }
    }
    const data = response.data as ResponseType
    switch (data.error) {
        case 1:
            error.username = 'Username length must contain 1 to 20 characters!'
            break
        case 2:
            error.username = 'Username must be only contain letters, numbers, periods, dashes, and underscores!'
            break
        case 3:
            error.email = 'Invalid email!'
            break
        case 4:
            error.password = 'Password length must contain 8 to 25 characters!'
            break
        case 5:
            error.password = 'Password length contains invalid characters!'
            break
        case 6:
            error.username = 'Username already exists!'
            break
        case 7:
            error.email = 'Email already exists!'
            break
        default:
            error.server = 'There was an error signing you up. Try again later!'
            break
    }
    return { ...data, data: error }
}

export const loginUser = async (username: string, password: string): Promise<any> => {
    // TODO: implement and add return type
}
