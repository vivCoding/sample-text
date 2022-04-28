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
                userId, username, email, messageSetting, name, bio, profileImg, posts, savedPosts, followers, following, followedTopics, conversations, blocked,
            } = action.payload
            state.userId = userId
            state.username = username
            state.email = email
            state.messageSetting = messageSetting
            state.name = name
            state.bio = bio
            state.profileImg = profileImg
            state.posts = posts
            state.savedPosts = savedPosts
            state.followers = followers
            state.following = following
            state.conversations = conversations
            state.followedTopics = followedTopics
            state.blocked = blocked
        },
        setCurrentAccount: (state, action: PayloadAction<AccountType>) => {
            const { username, email } = action.payload
            state.username = username
            state.email = email
        },
        setCurrentProfile: (state, action: PayloadAction<ProfileType>) => {
            const {
                messageSetting, name, bio, profileImg, posts, savedPosts, followers, following, followedTopics, conversations, blocked,
            } = action.payload
            state.messageSetting = messageSetting
            state.name = name
            state.bio = bio
            state.profileImg = profileImg
            state.posts = posts
            state.savedPosts = savedPosts
            state.followers = followers
            state.following = following
            state.conversations = conversations
            state.followedTopics = followedTopics
            state.blocked = blocked
        },
        clearUser: (state) => {
            state.userId = undefined
            state.username = undefined
            state.email = undefined
            state.messageSetting = false
            state.name = undefined
            state.bio = undefined
            state.profileImg = undefined
            state.posts = undefined
            state.savedPosts = undefined
            state.followers = undefined
            state.following = undefined
            state.followedTopics = undefined
            state.conversations = undefined
            state.blocked = undefined
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
        addFollowTopic: (state, action: PayloadAction<string>) => {
            if (state.followedTopics) {
                state.followedTopics.push(action.payload)
            } else {
                state.followedTopics = [action.payload]
            }
        },
        removeFollowTopic: (state, action: PayloadAction<string>) => {
            if (state.followedTopics) {
                state.followedTopics = state.followedTopics.filter((topicName) => topicName !== action.payload)
            }
        },
        addConversation: (state, action: PayloadAction<string>) => {
            if (state.conversations) {
                state.conversations.push(action.payload)
            } else {
                state.conversations = [action.payload]
            }
        },
        addBlocked: (state, action: PayloadAction<string>) => {
            if (state.blocked) {
                state.blocked.push(action.payload)
            } else {
                state.blocked = [action.payload]
            }
        },
        removeBlocked: (state, action: PayloadAction<string>) => {
            if (state.blocked) {
                state.blocked = state.blocked.filter((blockedId) => blockedId !== action.payload)
            }
        },
    },
})

export const {
    setCurrentUser, setCurrentAccount, setCurrentProfile, clearUser, setPostIds, addPostId, removePostId,
    addSavedPost, removeSavedPost, addFollowTopic, removeFollowTopic, addConversation, addBlocked, removeBlocked,
} = userSlice.actions
export default userSlice.reducer
