import { GeneralResponseType } from '../../types/api'
import { ProfileResponseType, UserlineResponseType } from '../../types/api/user'
import { ID } from '../../types/misc'
import client from '../client'

export const getProfile = async (usernameOrId: string): Promise<ProfileResponseType> => {
    const response = await client.post('/user/getprofile', { username_or_id: usernameOrId }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'User does not exist!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    if (resData.data) {
        resData.data.savedPosts = resData.data.saved_posts
        resData.data.followedTopics = resData.data.followed_topics
        resData.data.likedPosts = resData.data.liked_posts
        resData.data.dislikedPosts = resData.data.disliked_posts
        resData.data.lovedPosts = resData.data.loved_posts
        resData.data.messageSetting = resData.data.message_setting
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
    const resData = response.data as any
    if (resData.data) {
        resData.data.savedPosts = resData.data.saved_posts
        resData.data.followedTopics = resData.data.followed_topics
        resData.data.likedPosts = resData.data.liked_posts
        resData.data.lovedPosts = resData.data.loved_posts
        resData.data.dislikedPosts = resData.data.disliked_posts
        resData.data.messageSetting = resData.data.message_setting
    }
    return response.data as ProfileResponseType
}

export const getUserline = async (userId: string): Promise<UserlineResponseType> => {
    const response = await client.post('/userline/generateuserline', { user_id: userId }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 404) {
        return { success: false, error: 404, errorMessage: 'User does not exist!' }
    }
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    const posts: { postId: ID, interactionType: string }[] = []
    if (resData && resData.data) {
        resData.data.forEach((val: any) => {
            posts.push({ postId: val[0], interactionType: val[1] })
        })
        response.data.data = posts
    }
    return response.data as UserlineResponseType
}

export const updateMessageSetting = async (newMessageSetting: boolean): Promise<GeneralResponseType> => {
    const response = await client.post('/user/updatemessagesetting', { message_setting: newMessageSetting }).catch(() => ({ status: 404, data: undefined }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}
