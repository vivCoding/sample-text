import { GeneralResponseType } from '../../types/api'
import { PostResponseType } from '../../types/api/post'
import { ID } from '../../types/misc'
import { Comment } from '../../types/post'
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
    const resData = response.data as any
    if (resData.data) {
        resData.data.postId = resData.data.post_id
        resData.data.authorId = resData.data.author_id
        const comments: Comment[] = []
        if (resData.data.comments) {
            resData.data.comments.forEach((element: any) => {
                comments.push({
                    userId: element[0].user_id,
                    comment: element[1].comment,
                })
            });
        }
        resData.data.comments = comments
    }
    return resData as PostResponseType
}

export const getPost = async (postId: ID): Promise<PostResponseType> => {
    const response = await client.post('/post/getpost', { post_id: postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    if (resData.data) {
        resData.data.postId = resData.data.post_id
        resData.data.authorId = resData.data.author_id
        const comments: Comment[] = []
        if (resData.data.comments) {
            resData.data.comments.forEach((element: any) => {
                comments.push({
                    userId: element[0].user_id,
                    comment: element[1].comment,
                })
            });
        }
        resData.data.comments = comments
    }
    return response.data as PostResponseType
}

export const deletePost = async (postId: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/deletepost', { post_id: postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}

export const unlikePost = async (postId: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/unlikepost', { post_id: postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}

export const likePost = async (postId: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/likepost', { post_id: postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}

export const savePost = async (postId: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/savepost', { post_id: postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}

export const unsavePost = async (postId: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/unsavepost', { post_id: postId }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as GeneralResponseType
}

export const commentOnPost = async (postId: string, comment: string): Promise<GeneralResponseType> => {
    const response = await client.post('/post/commentonpost', { post_id: postId, comment }).catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    const resData = response.data as any
    if (resData.data) {
        const comments: Comment[] = []
        if (resData.data.comments) {
            resData.data.comments.forEach((element: any) => {
                comments.push({
                    userId: element[0].user_id,
                    comment: element[1].comment,
                })
            });
        }
        resData.data.comments = comments
    }
    return response.data as GeneralResponseType
}
