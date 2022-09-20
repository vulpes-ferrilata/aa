import { createSlice } from '@reduxjs/toolkit'
import api from 'features/auth/api'

export type Auth = {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: Auth = {
  accessToken: localStorage.getItem("ACCESS_TOKEN"),
  refreshToken: localStorage.getItem("REFRESH_TOKEN")
}

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.login.matchFulfilled,
        (state, {payload}) => {
          localStorage.setItem("ACCESS_TOKEN", payload.accessToken);
          localStorage.setItem("REFRESH_TOKEN", payload.refreshToken);

          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
        }
      )
      .addMatcher(
        api.endpoints.refresh.matchFulfilled,
        (state, {payload}) => {
          localStorage.setItem("ACCESS_TOKEN", payload.accessToken);

          state.accessToken = payload.accessToken;
        }
      )
      .addMatcher(
        api.endpoints.revoke.matchPending,
        (state, {payload}) => {
          localStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("REFRESH_TOKEN");

          state.accessToken = null;
          state.refreshToken = null;
        }
      )
  },
})

export default slice.reducer
