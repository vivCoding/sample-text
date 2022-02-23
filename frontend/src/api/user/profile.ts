import { ProfileResponseType } from '../../types/api'
import client from '../httpClient'

// eslint-disable-next-line import/prefer-default-export
export const updateProfile = async (
    { name, bio, pfp }: { name?: string, bio?: string, pfp?: string },
): Promise<ProfileResponseType> => {
    const response = await client.post('/user/updateProfile', { name, bio, pfp })
        .catch(() => ({ status: 404, data: undefined }))
    if (response.status !== 200) {
        return { success: false, error: 404, errorMessage: 'There was an issue changing your profile. Please try again later!' }
    }
    return response.data as ProfileResponseType
}
