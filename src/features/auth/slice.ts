import { createSlice } from '@reduxjs/toolkit';

import api from 'features/auth/api';
import { Token } from './types';

const enum LocalStorage {
    AccessToken = "AccessToken",
    RefreshToken = "RefreshToken",
};

const initialState: Token = {
    accessToken: localStorage.getItem(LocalStorage.AccessToken)?? undefined,
    refreshToken: localStorage.getItem(LocalStorage.RefreshToken)?? undefined,
};

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, {payload}) => {
            payload.accessToken && localStorage.setItem(LocalStorage.AccessToken, payload.accessToken);
            payload.refreshToken && localStorage.setItem(LocalStorage.RefreshToken, payload.refreshToken);

            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
            }
        )
        .addMatcher(
            api.endpoints.refresh.matchFulfilled,
            (state, {payload}) => {
            payload.accessToken && localStorage.setItem(LocalStorage.AccessToken, payload.accessToken);

            state.accessToken = payload.accessToken;
            }
        )
        .addMatcher(
            api.endpoints.revoke.matchPending,
            (state, {payload}) => {
            localStorage.removeItem(LocalStorage.AccessToken);
            localStorage.removeItem(LocalStorage.RefreshToken);

            return {};
            }
        )
    },
});

export default slice.reducer;
