import { configureStore, type Reducer } from "@reduxjs/toolkit"
import authReducer, { type AuthState } from "./auth/reducer"
import isPreloadReducer, { type IsPreloadState } from "./is-preload/reducer"

export const store = configureStore({
  reducer: {
    auth: authReducer as Reducer<AuthState>,
    isPreload: isPreloadReducer as Reducer<IsPreloadState>,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
