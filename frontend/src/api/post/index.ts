import { GeneralResponseType } from '../../types/api'
import { PostResponseType } from '../../types/api/post'
import { ID } from '../../types/misc'
import { PostType } from '../../types/post'
import client from '../client'

export const createPost = async ({
    title, caption, img, anonymous,
}:
{ title: string, caption: string, img: string, anonymous: boolean }): Promise<PostResponseType> => {
    const response = await client.post('/post/createpost', {
        title, caption, img, anonymous,
    }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as PostResponseType
}

export const getPost = async (postId: ID): Promise<PostResponseType> => {
    const response = await client.post('/post/getpost', { postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as PostResponseType
}

export const deletePost = async (postId: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/deletepost', { postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}
