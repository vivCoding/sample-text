import { UserType } from './user';

export interface BaseResponseType {
    success: boolean
}

export interface GeneralResponseType extends BaseResponseType {
    data?: any,
    error?: any
}

export interface UserResponseType extends BaseResponseType {
    data: UserType,
    error: number
}
