import { BaseResponseType, FetcherResponseType } from '.';
import { AccountType, ProfileType, UserType } from '../user';

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

export interface ProfileFetcherResponseType extends FetcherResponseType {
    data?: ProfileType
}

export interface ProfileHookResponseType {
    loading: boolean,
    error: boolean,
    auth: boolean,
    found: boolean,
    data?: ProfileType
}

export interface AccountFetchResponseType extends FetcherResponseType {
    data?: AccountType
}

export interface AccountHookResponseType {
    loading: boolean,
    error: boolean,
    auth: boolean,
    username?: string,
}
