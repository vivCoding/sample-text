import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user'

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
})

export {
    setCurrentUser, setCurrentAccount, setCurrentProfile, clearUser, setPostIds, addPostId, removePostId, addSavedPost, removeSavedPost, addFollowTopic, removeFollowTopic,
} from './reducers/user'
