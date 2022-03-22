import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserSliceType } from '../../types/redux'
import { ProfileType, AccountType, UserType } from '../../types/user'

const initialState: UserSliceType = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserType>) => {
            const {
                userId, username, email, name, bio, profileImg, posts,
            } = action.payload
            state.userId = userId
            state.username = username
            state.email = email
            state.name = name
            state.bio = bio
            state.profileImg = profileImg
            state.posts = posts
        },
        setCurrentAccount: (state, action: PayloadAction<AccountType>) => {
            const { username, email } = action.payload
            state.username = username
            state.email = email
        },
        setCurrentProfile: (state, action: PayloadAction<ProfileType>) => {
            const { name, bio, profileImg } = action.payload
            state.name = name
            state.bio = bio
            state.profileImg = profileImg
        },
        clearUser: (state) => {
            state.userId = undefined
            state.username = undefined
            state.email = undefined
            state.name = undefined
            state.bio = undefined
            state.profileImg = undefined
        },
    },
})

export const {
    setCurrentUser, setCurrentAccount, setCurrentProfile, clearUser,
} = userSlice.actions
export default userSlice.reducer
