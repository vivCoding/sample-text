import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import { userFetcher } from '.'
import { setCurrentAccount } from '../../store'
import { AccountFetchResponseType, AccountHookResponseType, AccountResponseType } from '../../types/api/user'
import { ReduxStoreType } from '../../types/redux'
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

export const useUserAccount = (): AccountHookResponseType => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const { data, error, isValidating } = useSWR<AccountFetchResponseType>(username ? null : '/user/getaccount', userFetcher)

    if (data && data.status === 200 && data.data) {
        dispatch(setCurrentAccount(data.data))
    }

    return {
        loading: isValidating,
        error: error !== undefined || (data !== undefined && data.status !== 200),
        auth: data !== undefined && data.status === 200,
        username: username ?? data?.data?.username,
    }
}
