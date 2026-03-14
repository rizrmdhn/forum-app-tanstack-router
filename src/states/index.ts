import { configureStore, type Reducer } from '@reduxjs/toolkit';
import type { StateInterface, IThread, IUser } from '@/types';
import authReducer, { type AuthState } from './auth/reducer';
import isPreloadReducer, { type IsPreloadState } from './is-preload/reducer';
import threadReducer from './thread/reducer';
import userReducer from './user/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer as Reducer<AuthState>,
    isPreload: isPreloadReducer as Reducer<IsPreloadState>,
    thread: threadReducer as Reducer<StateInterface<IThread[]>>,
    user: userReducer as Reducer<StateInterface<IUser[]>>,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
