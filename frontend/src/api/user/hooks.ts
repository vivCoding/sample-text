import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import { setCurrentProfile, setCurrentAccount } from '../../store'
import { ReduxStoreType } from '../../types/redux'
import { AccountType, ProfileType } from '../../types/user'
import client from '../httpClient'

interface ProfileFetcherResponseType {
    status: number,
    data: ProfileType
}

interface AccountFetchResponseType {
    status: number,
    data: AccountType
}

interface UserHookResponseType {
    loading: boolean,
    error: boolean,
    auth: boolean,
}

export const userFetcher = (url: string, username?: string): Promise<any> => (
    client.post(url, { username }).then((res) => ({ status: res.status, data: res.data }))
)

export const useUserAccount = (): UserHookResponseType => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const { data, error } = useSWR<AccountFetchResponseType>(username ? null : ['/user/getaccount'], userFetcher)
    const [auth, setAuth] = useState(false)

    if (data && data.status === 200) {
        dispatch(setCurrentAccount(data.data))
        setAuth(true)
    }
    if (data && data.status === 401) {
        setAuth(false)
    }

    return {
        loading: !data && !error,
        error: error !== undefined,
        auth,
    }
}

export const useUserProfile = (username: string): UserHookResponseType => {
    const { username: currentUsername } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const { data, error } = useSWR<ProfileFetcherResponseType>(
        currentUsername && currentUsername === username ? null : ['/user/viewprofile', username],
        userFetcher,
    )
    const [auth, setAuth] = useState(false)

    if (data && data.status === 200) {
        dispatch(setCurrentProfile(data.data))
        setAuth(true)
    }
    if (data && data.status === 401) {
        setAuth(false)
    }

    return {
        loading: !data && !error,
        error: error !== undefined,
        auth,
    }
}
