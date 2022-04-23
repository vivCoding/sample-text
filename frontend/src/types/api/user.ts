import { BaseResponseType, FetcherResponseType } from '.';
import { ID } from '../misc';
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

export interface UserlineResponseType extends BaseResponseType {
    data?: {
        postId: ID,
        interactionType: string,
    } []
}
