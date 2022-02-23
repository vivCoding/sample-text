import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import { setCurrentProfile, setCurrentAccount } from '../../store'
import { ReduxStoreType } from '../../types/redux'
import { AccountType, ProfileType } from '../../types/user'
import client from '../httpClient'

// TODO: move to types folder
interface ProfileFetcherResponseType {
    status: number,
    data?: ProfileType
}

interface AccountFetchResponseType {
    status: number,
    data?: AccountType
}

interface UserHookResponseType {
    loading: boolean,
    error: boolean,
    auth: boolean,
}

interface ProfileHookResponseType extends UserHookResponseType {
    data?: ProfileType
}

export const userFetcher = (url: string, username?: string): Promise<any> => (
    client.post(url, { username }).then((res) => ({ status: res.status, data: res.data }))
)

export const useUserAccount = (): UserHookResponseType => {
    const { username } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const { data, error, isValidating } = useSWR<AccountFetchResponseType>(username ? null : '/user/getaccount', userFetcher)
    const [auth, setAuth] = useState(username !== undefined)

    if (data && data.status === 200 && data.data) {
        dispatch(setCurrentAccount(data.data))
        setAuth(true)
    }
    if (data && data.status === 401) {
        setAuth(false)
    }

    return {
        loading: isValidating,
        error: (data && data.status !== 200 && data.status !== 401) || error !== undefined,
        auth,
    }
}

// TODO: send profile
export const useUserProfile = (username?: string): ProfileHookResponseType => {
    const { username: currentUsername } = useSelector((state: ReduxStoreType) => state.user)
    const dispatch = useDispatch()

    const { data, error, isValidating } = useSWR<ProfileFetcherResponseType>(
        (currentUsername && username && currentUsername === username)
        || (currentUsername && !username) ? null : ['/user/viewprofile', username ?? currentUsername],
        userFetcher,
    )
    const [profile, setProfile]: [ProfileType | undefined, any] = useState(undefined)
    const [auth, setAuth] = useState(currentUsername !== undefined)

    if (data && data.status === 200 && data.data) {
        if ((currentUsername && username && currentUsername === username) || (currentUsername && !username)) {
            dispatch(setCurrentProfile(data.data))
        } else {
            setProfile(data.data)
        }
        setAuth(true)
    }
    if (data && data.status === 401) {
        setAuth(false)
        setProfile(undefined)
    }

    return {
        loading: isValidating,
        error: error !== undefined,
        auth,
        data: profile,
    }
}
