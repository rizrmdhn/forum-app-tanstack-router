import type { ActionInterface, StateInterface, IDetailThread } from '@/types';
import type { AppDispatch, RootState } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';

const ActionType = {
  SET_DETAIL_THREAD: 'SET_DETAIL_THREAD',
  UPDATE_DETAIL_THREAD: 'UPDATE_DETAIL_THREAD',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

type SetDetailThreadAction = ActionInterface<
  typeof ActionType.SET_DETAIL_THREAD,
  StateInterface<IDetailThread>
>;

type UpdateDetailThreadAction = ActionInterface<
  typeof ActionType.UPDATE_DETAIL_THREAD,
  Partial<IDetailThread>
>;

export type DetailThreadAction =
  | SetDetailThreadAction
  | UpdateDetailThreadAction;

export function setDetailThreadActionCreator(
  state: StateInterface<IDetailThread>
): SetDetailThreadAction {
  return { type: ActionType.SET_DETAIL_THREAD, payload: state };
}

export function updateDetailThreadActionCreator(
  fields: Partial<IDetailThread>
): UpdateDetailThreadAction {
  return { type: ActionType.UPDATE_DETAIL_THREAD, payload: fields };
}

export function asyncLoadDetailThread(threadId: string) {
  return asyncHandler<AppDispatch, RootState>(
    async (dispatch, getState) => {
      const state = getState();
      dispatch(
        setDetailThreadActionCreator({
          status: 'loading',
          data: state.detailThread.data,
          error: null,
        })
      );
      const thread = await api.getThreadById(threadId);
      dispatch(
        setDetailThreadActionCreator({
          status: 'success',
          data: thread,
          error: null,
        })
      );
    },
    {
      onError: (dispatch, error, getState) =>
        dispatch(
          setDetailThreadActionCreator({
            status: 'error',
            data: getState().detailThread.data,
            error: (error as Error).message,
          })
        ),
    }
  );
}
