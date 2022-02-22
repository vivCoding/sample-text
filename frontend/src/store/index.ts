import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user'

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
})

export { setCurrentUser } from './reducers/user'
