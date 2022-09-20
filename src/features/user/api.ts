import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from 'app/store'

import { Mutex } from 'async-mutex'

import authApi from 'features/auth/api'

export type User = {
    id: string;
    displayName: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.GATEWAY_ENDPOINT || (window.location.origin + "/api-gateway")}/api/v1/user`, 
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
    reducerPath: "userAPI",
    baseQuery: baseQueryWithReAuthentication,
    endpoints: builder => ({
        getUser: builder.query<User, string>({
            query: (userID: string) => ({
                url: `/${userID}`,
                method: "GET",
            }),
        })
    })
});

export default api;

export const { useGetUserQuery } = api