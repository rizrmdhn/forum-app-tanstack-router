import type { IUser } from '@/types';
import type { AuthUserAction } from './action';

export type AuthState = IUser | null;

const initialState: AuthState = null;
const _ciTest: string = 123; // intentional error to test CI

function authReducer(
  state: AuthState = initialState,
  action: AuthUserAction
): AuthState {
  switch (action.type) {
    case 'RECEIVE_AUTH_USER':
      return action.payload.authUser;
    case 'UNSET_AUTH_USER':
      return null;
    default:
      return state;
  }
}

export default authReducer;
