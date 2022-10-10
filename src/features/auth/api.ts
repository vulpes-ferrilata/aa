import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type RegisterRequest = {
    displayName: string;
    email: string;
    password: string;
};

type LoginRequest = {
    email: string;
    password: string;
};

type Token = {
    accessToken: string;
    refreshToken: string;
};

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_GATEWAY_ENDPOINT || (window.location.origin + "/api-gateway")}/api/v1/auth`, 
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