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
    messageSetting?: boolean,
    posts?: ID[],
    followers?: ID[],
    following?: ID[],
    followedTopics?: ID[],
    likedPosts?: ID[],
    lovedPosts?: ID[],
    dislikedPosts?: ID[],
    comments?: ID[],
    savedPosts?: ID[],
    conversations?: ID[],
    blocked?: ID[]
}

export interface UserType extends AccountType, ProfileType {
    userId: ID,
}
