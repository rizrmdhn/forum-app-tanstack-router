import type { ActionInterface, StateInterface, IThread } from '@/types';
import type { AppDispatch, RootState } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';

const ActionType = {
  SET_THREADS: 'SET_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  UPDATE_THREAD: 'UPDATE_THREAD',
  REPLACE_THREAD: 'REPLACE_THREAD',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

type SetThreadsAction = ActionInterface<
  typeof ActionType.SET_THREADS,
  StateInterface<IThread[]>
>;

type AddThreadAction = ActionInterface<typeof ActionType.ADD_THREAD, IThread>;

type UpdateThreadAction = ActionInterface<
  typeof ActionType.UPDATE_THREAD,
  Partial<IThread> & { id: string }
>;

type ReplaceThreadAction = ActionInterface<
  typeof ActionType.REPLACE_THREAD,
  { oldId: string; thread: IThread }
>;

export type ThreadAction =
  | SetThreadsAction
  | AddThreadAction
  | UpdateThreadAction
  | ReplaceThreadAction;

export function addThreadActionCreator(thread: IThread): AddThreadAction {
  return { type: ActionType.ADD_THREAD, payload: thread };
}

export function updateThreadActionCreator(
  thread: Partial<IThread> & { id: string }
): UpdateThreadAction {
  return { type: ActionType.UPDATE_THREAD, payload: thread };
}

export function replaceThreadActionCreator(
  oldId: string,
  thread: IThread
): ReplaceThreadAction {
  return { type: ActionType.REPLACE_THREAD, payload: { oldId, thread } };
}

export function setThreadsActionCreator(
  state: StateInterface<IThread[]>
): SetThreadsAction {
  return { type: ActionType.SET_THREADS, payload: state };
}

export function asyncLoadThreads() {
  return asyncHandler<AppDispatch, RootState>(
    async (dispatch, getState) => {
      const existing = getState().thread.data;
      dispatch(
        setThreadsActionCreator({
          status: 'loading',
          data: existing,
          error: null,
        })
      );
      const threads = await api.getAllThreads();
      dispatch(
        setThreadsActionCreator({
          status: 'success',
          data: threads,
          error: null,
        })
      );
    },
    {
      onError: (dispatch, error, getState) => {
        const existing = getState().thread.data;
        dispatch(
          setThreadsActionCreator({
            status: 'error',
            data: existing,
            error: (error as Error).message,
          })
        );
      },
    }
  );
}
