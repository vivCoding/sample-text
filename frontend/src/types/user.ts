export interface AccountType {
    username: string,
    email: string,
}

export interface ProfileType {
    name?: string,
    bio?: string,
    pfp?: string,
}

export interface UserType extends AccountType, ProfileType {}
