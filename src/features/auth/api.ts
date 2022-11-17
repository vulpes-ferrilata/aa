import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { LoginRequest, RegisterRequest, Token } from 'features/auth/types';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL?? ""}/api/v1/auth`, 
    prepareHeaders: (headers, {getState}) => {
        const language = localStorage.getItem("i18nextLng");
        if (language) {
            headers.set("Accept-Language", language);
        }
        return headers;
    },
});

const api = createApi({
    reducerPath: "authAPI",
    baseQuery: baseQuery,
    endpoints: builder => ({
        register: builder.mutation({
            query: (registerRequest: RegisterRequest) => ({
                url: "/register",
                method: "POST",
                body: registerRequest,
            }),
        }),
        login: builder.mutation<Token, LoginRequest>({
            query: (loginRequest: LoginRequest) => ({
                url: "/login",
                method: "POST",
                body: loginRequest,
            })
        }),
        revoke: builder.mutation<void, string>({
            query: (refreshToken: string) => ({
                url: "/revoke",
                method: "POST",
                body: {
                    refreshToken: refreshToken,
                }
            })
        }),
        refresh: builder.mutation<Token, string>({
            query: (refreshToken: string) => ({
                url: "/refresh",
                method: "POST",
                body: {
                    refreshToken: refreshToken,
                }
            })
        })
    })
});

export default api;

export const { useRegisterMutation, useLoginMutation, useRevokeMutation } = api;