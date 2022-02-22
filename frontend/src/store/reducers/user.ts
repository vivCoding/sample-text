import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserSliceType } from '../../types/redux'
import { UserType } from '../../types/user'

const initialState: UserSliceType = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserType>) => {
            const {
                username, email, name, bio, pfp,
            } = action.payload
            state.username = username
            state.email = email
            state.name = name
            state.bio = bio
            state.pfp = pfp
        },
        clearUser: (state) => {
            state.username = undefined
            state.email = undefined
        },
    },
})

export const { setCurrentUser } = userSlice.actions
export default userSlice.reducer
