import { createSlice } from '@reduxjs/toolkit';

import api from 'features/auth/api';

const enum LocalStorage {
  AccessToken = "ACCESS_TOKEN",
  RefreshToken = "REFRESH_TOKEN",
};

export type Auth = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: Auth = {
  accessToken: localStorage.getItem(LocalStorage.AccessToken),
  refreshToken: localStorage.getItem(LocalStorage.RefreshToken)
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
          localStorage.setItem(LocalStorage.AccessToken, payload.accessToken);
          localStorage.setItem(LocalStorage.RefreshToken, payload.refreshToken);

          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
        }
      )
      .addMatcher(
        api.endpoints.refresh.matchFulfilled,
        (state, {payload}) => {
          localStorage.setItem(LocalStorage.AccessToken, payload.accessToken);

          state.accessToken = payload.accessToken;
        }
      )
      .addMatcher(
        api.endpoints.revoke.matchPending,
        (state, {payload}) => {
          localStorage.removeItem(LocalStorage.AccessToken);
          localStorage.removeItem(LocalStorage.RefreshToken);

          state.accessToken = null;
          state.refreshToken = null;
        }
      )
  },
});

export default slice.reducer;
