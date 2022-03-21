import { GeneralResponseType } from '../../types/api'
import { PostType } from '../../types/post'
import client from '../client'

export const createPost = async ({ title, caption, img }: { title: string, caption: string, img: string }): Promise<any> => {
    console.log('not implemented')
    return undefined
}

export const getPost = async (postId: string): Promise<any> => {
    console.log('not implemented')
    return undefined
}

export const deletePost = async (postId: string): Promise<any> => {
    console.log('not implemented')
    return undefined
}
