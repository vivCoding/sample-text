import { ID } from './misc';

export interface UserSliceType {
    userId?: ID,
    username?: string,
    email?: string,
    name?: string,
    bio?: string,
    allowDms?: boolean,
    profileImg?: string,
    posts?: ID[],
    savedPosts?: ID[],
    followers?: ID[],
    following?: ID[],
    followedTopics?: ID[],
}

export interface ReduxStoreType {
    user: UserSliceType,
}
