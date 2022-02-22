import { ProfileType } from './user';

export interface UserSliceType extends ProfileType {
    username?: string,
    email?: string
}

export interface ReduxStoreType {
    user: UserSliceType
}
