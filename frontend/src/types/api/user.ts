import { BaseResponseType, FetcherResponseType } from '.';
import { AccountType, ProfileType, UserType } from '../user';

export interface UserResponseType extends BaseResponseType {
    data?: UserType,
}

export interface ProfileResponseType extends BaseResponseType {
    data?: ProfileType,
}

export interface AccountResponseType extends BaseResponseType {
    data?: AccountType,
}

// unused swr stuff, ignore
export interface ProfileFetcherResponseType extends FetcherResponseType {
    data?: ProfileType
}
// unused swr stuff, ignore
export interface ProfileHookResponseType {
    loading: boolean,
    error: boolean,
    auth: boolean,
    found: boolean,
    data?: ProfileType
}

// unused swr stuff, ignore
export interface AccountFetchResponseType extends FetcherResponseType {
    data?: AccountType
}
// unused swr stuff, ignore
export interface AccountHookResponseType {
    loading: boolean,
    error: boolean,
    auth: boolean,
    username?: string,
}
