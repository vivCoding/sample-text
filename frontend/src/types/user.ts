export interface AccountType {
    username: string,
    email: string,
}

export interface ProfileType {
    name?: string,
    bio?: string,
    profileImg?: string,
}

export interface UserType extends AccountType, ProfileType {}
