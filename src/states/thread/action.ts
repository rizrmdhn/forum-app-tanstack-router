import type { ActionInterface, StateInterface, IThread } from '@/types';
import type { AppDispatch } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';

const ActionType = {
  SET_THREADS: 'SET_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  UP_VOTE_THREAD: 'UP_VOTE_THREAD',
  DOWN_VOTE_THREAD: 'DOWN_VOTE_THREAD',
  NEUTRAL_VOTE_THREAD: 'NEUTRAL_VOTE_THREAD',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

type SetThreadsAction = ActionInterface<
  typeof ActionType.SET_THREADS,
  StateInterface<IThread[]>
>;

export type ThreadAction = SetThreadsAction;

export function setThreadsActionCreator(
  state: StateInterface<IThread[]>
): SetThreadsAction {
  return { type: ActionType.SET_THREADS, payload: state };
}

export function asyncLoadThreads() {
  return asyncHandler<AppDispatch>(
    async (dispatch) => {
      dispatch(setThreadsActionCreator({ status: 'loading', data: null, error: null }));
      const threads = await api.getAllThreads();
      dispatch(setThreadsActionCreator({ status: 'success', data: threads, error: null }));
    },
    {
      onError: (dispatch, error) =>
        dispatch(
          setThreadsActionCreator({
            status: 'error',
            data: null,
            error: (error as Error).message,
          })
        ),
    }
  );
}
