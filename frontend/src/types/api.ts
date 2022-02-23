import { AccountType, ProfileType, UserType } from './user';

export interface BaseResponseType {
    success: boolean
    error: number,
    errorMessage?: string,
}

export interface GeneralResponseType extends BaseResponseType {
    data?: any,
    error: number,
}

export interface UserResponseType extends BaseResponseType {
    data?: UserType,
    error: number,
    errorMessage?: string,
}

export interface ProfileResponseType extends BaseResponseType {
    data?: ProfileType,
    error: number,
    errorMessage?: string,
}

export interface AccountResponseType extends BaseResponseType {
    data?: AccountType,
    error: number,
    errorMessage?: string,
}
