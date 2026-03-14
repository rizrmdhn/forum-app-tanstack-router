import { configureStore, type Reducer } from '@reduxjs/toolkit';
import type {
  StateInterface,
  IThread,
  IUser,
  ILeaderboard,
  IDetailThread,
} from '@/types';
import authReducer, { type AuthState } from './auth/reducer';
import isPreloadReducer, { type IsPreloadState } from './is-preload/reducer';
import threadReducer from './thread/reducer';
import userReducer from './user/reducer';
import leaderboardReducer from './leaderboard/reducer';
import detailThreadReducer from './detail-thread/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer as Reducer<AuthState>,
    isPreload: isPreloadReducer as Reducer<IsPreloadState>,
    thread: threadReducer as Reducer<StateInterface<IThread[]>>,
    user: userReducer as Reducer<StateInterface<IUser[]>>,
    leaderboard: leaderboardReducer as Reducer<StateInterface<ILeaderboard[]>>,
    detailThread: detailThreadReducer as Reducer<StateInterface<IDetailThread>>,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
