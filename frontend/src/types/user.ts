import { ID } from './misc';

export interface AccountType {
    username: string,
    email: string,
}

export interface ProfileType {
    username: string,
    name?: string,
    bio?: string,
    profileImg?: string,
}

export interface UserType extends AccountType, ProfileType {
    userId: ID,
}
