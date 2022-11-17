import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

import { RootState } from 'app/store';
import authApi from 'features/auth/api';
import { Message } from 'features/chat/types';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL?? ""}/api/v1/chat/messages`, 
    prepareHeaders: (headers, {getState}) => {
        const language = localStorage.getItem("i18nextLng");
        if (language) {
            headers.set("Accept-Language", language);   
        }

        const accessToken = (getState() as RootState).auth.accessToken;
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);   
        }
        return headers;
    },
});

const mutex = new Mutex();

const baseQueryWithReAuthentication: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async(args, api, extraOptions) => {
    await mutex.waitForUnlock();

    const result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        const state = api.getState() as RootState;
        if (!state.auth.refreshToken) {
            return result;
        }
        
        const release = await mutex.acquire();

        try {
            const refreshResult = await api.dispatch(authApi.endpoints.refresh.initiate(state.auth.refreshToken));

            if ("data" in refreshResult) {
                return baseQueryWithReAuthentication(args, api, extraOptions);
            } else {
                api.dispatch(authApi.endpoints.revoke.initiate(state.auth.refreshToken));
            }
        } finally {
            release();
        }
    }

    return result;
};

const api = createApi({
    reducerPath: "chatAPI",
    tagTypes: ["Messages"],
    baseQuery: baseQueryWithReAuthentication,
    endpoints: builder => ({
        findMessages: builder.query<Message[], string>({
            query: (roomID: string) => ({
                url: "",
                params: {
                    roomID: roomID,
                },
                method: "GET"
            })
        }),
        sendMessage: builder.mutation<void, Omit<Message, "id" | "userID"> & {roomID?: string}>({
            query: (message: Omit<Message, "id" | "userID"> & {roomID: string}) => ({
                url: "",
                method: "POST",
                body: {
                    roomID: message.roomID,
                    detail: message.detail,
                }
            }),
        })
    })
});

export default api;

export const { useFindMessagesQuery, useSendMessageMutation } = api;