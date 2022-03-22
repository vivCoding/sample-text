import { ID } from './misc';

export interface UserSliceType {
    userId?: ID,
    username?: string,
    email?: string,
    name?: string,
    bio?: string,
    profileImg?: string,
    posts?: ID[],
}

export interface ReduxStoreType {
    user: UserSliceType
}
