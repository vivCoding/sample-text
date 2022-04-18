import { ID } from './misc';

export interface AccountType {
    username: string,
    email: string,
}

export interface ProfileType {
    userId: ID,
    username: string,
    name?: string,
    bio?: string,
    profileImg?: string,
    posts?: ID[],
    followers?: ID[],
    following?: ID[],
    followedTopics?: ID[],
    likedPosts?: ID[],
    comments?: ID[],
    savedPosts?: ID[],
}

export interface UserType extends AccountType, ProfileType {
    userId: ID,
}
