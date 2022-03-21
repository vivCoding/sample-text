import { ID } from './misc';

export interface AccountType {
    username: string,
    email: string,
}

export interface ProfileType {
    name?: string,
    bio?: string,
    profileImg?: string,
}

export interface UserType extends AccountType, ProfileType {
    // TODO: implement user id
    userId: ID,
}
