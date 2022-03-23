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
    posts: ID[],
}

export interface UserType extends AccountType, ProfileType {
    userId: ID,
}
