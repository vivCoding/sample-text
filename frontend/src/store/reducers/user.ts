import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ID } from '../../types/misc'
import { UserSliceType } from '../../types/redux'
import { ProfileType, AccountType, UserType } from '../../types/user'

const initialState: UserSliceType = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserType>) => {
            const {
                userId, username, email, name, bio, profileImg, posts, savedPosts, followers, following,
            } = action.payload
            state.userId = userId
            state.username = username
            state.email = email
            state.name = name
            state.bio = bio
            state.profileImg = profileImg
            state.posts = posts
            state.savedPosts = savedPosts
            state.followers = followers
            state.following = following
        },
        setCurrentAccount: (state, action: PayloadAction<AccountType>) => {
            const { username, email } = action.payload
            state.username = username
            state.email = email
        },
        setCurrentProfile: (state, action: PayloadAction<ProfileType>) => {
            const {
                name, bio, profileImg, posts, savedPosts, followers, following,
            } = action.payload
            state.name = name
            state.bio = bio
            state.profileImg = profileImg
            state.posts = posts
            state.savedPosts = savedPosts
            state.followers = followers
            state.following = following
        },
        clearUser: (state) => {
            state.userId = undefined
            state.username = undefined
            state.email = undefined
            state.name = undefined
            state.bio = undefined
            state.profileImg = undefined
            state.posts = undefined
            state.savedPosts = undefined
            state.followers = undefined
            state.following = undefined
        },
        setPostIds: (state, action: PayloadAction<ID[]>) => {
            state.posts = action.payload
        },
        addPostId: (state, action: PayloadAction<ID>) => {
            if (state.posts) {
                state.posts.push(action.payload)
            } else {
                state.posts = [action.payload]
            }
        },
        removePostId: (state, action: PayloadAction<ID>) => {
            if (state.posts) {
                state.posts = state.posts.filter((postId) => postId !== action.payload)
            }
        },
        addSavedPost: (state, action: PayloadAction<ID>) => {
            if (state.savedPosts) {
                state.savedPosts.push(action.payload)
            } else {
                state.savedPosts = [action.payload]
            }
        },
        removeSavedPost: (state, action: PayloadAction<ID>) => {
            if (state.savedPosts) {
                state.savedPosts = state.savedPosts.filter((postId) => postId !== action.payload)
            }
        },
    },
})

export const {
    setCurrentUser, setCurrentAccount, setCurrentProfile, clearUser, setPostIds, addPostId, removePostId, addSavedPost, removeSavedPost,
} = userSlice.actions
export default userSlice.reducer
