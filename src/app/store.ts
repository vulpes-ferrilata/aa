import { configureStore } from '@reduxjs/toolkit'

import authApi from 'features/auth/api'
import userApi from 'features/user/api'
import catanApi from 'features/catan/api'

import authReducer from 'features/auth/slice'
import messagesReducer from 'features/messages/slice'

import rtkQueryMiddleware from './middlewares/rtkQueryMiddleware'
import websocketMiddleware from './middlewares/websocketMiddleware'

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [catanApi.reducerPath]: catanApi.reducer,
        auth: authReducer,
        messages: messagesReducer,
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, catanApi.middleware, rtkQueryMiddleware, websocketMiddleware)
    },
})

export type RootState = ReturnType<typeof store.getState>

export default store