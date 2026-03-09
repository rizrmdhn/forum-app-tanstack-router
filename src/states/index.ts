import { configureStore, type Reducer } from "@reduxjs/toolkit"
import authReducer, { type AuthState } from "./auth/reducer"

export const store = configureStore({
  reducer: {
    auth: authReducer as Reducer<AuthState>,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
