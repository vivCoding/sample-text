import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserSliceType } from '../../types/redux'
import { ProfileType, AccountType, UserType } from '../../types/user'

const initialState: UserSliceType = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserType>) => {
            state = { ...state, ...action.payload }
        },
        setCurrentAccount: (state, action: PayloadAction<AccountType>) => {
            state = { ...state, ...action.payload }
        },
        setCurrentProfile: (state, action: PayloadAction<ProfileType>) => {
            state = { ...state, ...action.payload }
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
