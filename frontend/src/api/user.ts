import ResponseType from '../types/response'

export const createUser = async (username: string, email: string, password: string): Promise<ResponseType> => {
    const response = await fetch('localhost:5000/api/user/createaccount', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    if (response.status !== 200) {
        return { success: false, error: -1 }
    }
    const data = await response.json()
    return data as ResponseType
}

export const loginUser = async (): Promise<any> => {
    // TODO: implement and change return type
}
