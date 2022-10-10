import { configureStore } from '@reduxjs/toolkit';

import authApi from 'features/auth/api';
import userApi from 'features/user/api';
import catanApi from 'features/catan/api';
import chatApi from 'features/chat/api';

import authReducer from 'features/auth/slice';
import notificationReducer from 'features/notification/slice';
import colorSchemeReducer from 'features/colorScheme/slice';

import rtkQueryMiddleware from './middlewares/rtkQueryMiddleware';
import websocketMiddleware from './middlewares/websocketMiddleware';

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [catanApi.reducerPath]: catanApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        auth: authReducer,
        notifications: notificationReducer,
        colorScheme: colorSchemeReducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            catanApi.middleware,
            chatApi.middleware,
            rtkQueryMiddleware,
            websocketMiddleware
        )
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;