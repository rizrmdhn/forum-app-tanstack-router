import type { ActionInterface, StateInterface, IUser } from '@/types';
import type { AppDispatch, RootState } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';

const ActionType = {
  SET_USERS: 'SET_USERS',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

type SetUsersAction = ActionInterface<
  typeof ActionType.SET_USERS,
  StateInterface<IUser[]>
>;

export type UserAction = SetUsersAction;

export function setUsersActionCreator(
  state: StateInterface<IUser[]>
): SetUsersAction {
  return { type: ActionType.SET_USERS, payload: state };
}

export function asyncLoadUsers() {
  return asyncHandler<AppDispatch, RootState>(
    async (dispatch, getState) => {
      const state = getState();
      dispatch(
        setUsersActionCreator({
          status: 'loading',
          data: state.user.data,
          error: null,
        })
      );
      const users = await api.getAllUsers();
      dispatch(
        setUsersActionCreator({ status: 'success', data: users, error: null })
      );
    },
    {
      onError: (dispatch, error, getState) => {
        const existing = getState() as { user: StateInterface<IUser[]> };
        dispatch(
          setUsersActionCreator({
            status: 'error',
            data: existing.user.data,
            error: (error as Error).message,
          })
        );
      },
    }
  );
}
