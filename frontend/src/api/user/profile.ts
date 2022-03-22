import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import { userFetcher } from '.'
import { setCurrentProfile } from '../../store'
import { ProfileFetcherResponseType, ProfileHookResponseType, ProfileResponseType } from '../../types/api/user'
import { ID } from '../../types/misc'
import { ProfileType } from '../../types/user'
import client from '../client'
import { useUserAccount } from './account'

export const getProfile = async ({ username, userId }: { username?: string, userId?: ID }): Promise<ProfileResponseType> => {
    const response = await client.post('/user/getprofile', { username, userId }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'User does not exist!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as ProfileResponseType
}

export const editProfile = async (
    { name, bio, profileImg }: { name?: string, bio?: string, profileImg?: string },
): Promise<ProfileResponseType> => {
    const response = await client.post('/user/editprofile', { name, bio, profile_img: profileImg })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your profile. Please try again later!' }
    }
    return response.data as ProfileResponseType
}

// unused swr stuff, ignore
export const useUserProfile = (username?: string): ProfileHookResponseType => {
    const { username: currentUsername, auth: accountAuth } = useUserAccount()
    const dispatch = useDispatch()

    const { data, error, isValidating } = useSWR<ProfileFetcherResponseType>(username ? ['/user/getprofile', username] : null, userFetcher)
    const [profile, setProfile]: [ProfileType | undefined, any] = useState(undefined)

    if (accountAuth && data && data.status === 200 && data.data) {
        if ((currentUsername && username && currentUsername === username) || (currentUsername && !username)) {
            dispatch(setCurrentProfile(data.data))
        } else {
            setProfile(data.data)
        }
    }

    return {
        loading: isValidating,
        error: error !== undefined || (data !== undefined && data.status !== 200),
        auth: accountAuth && data !== undefined && data.status !== 401,
        found: data !== undefined && data.status === 200,
        data: profile,
    }
}
