import type { AppDispatch, RootState } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';
import { setThreadsActionCreator } from '../thread/action';
import { setUsersActionCreator } from '../user/action';

export function asyncLoadThreadsAndUsers() {
  return asyncHandler<AppDispatch, RootState>(async (dispatch, getState) => {
    const state = getState();
    dispatch(
      setThreadsActionCreator({ status: 'loading', data: state.thread.data, error: null })
    );
    dispatch(
      setUsersActionCreator({ status: 'loading', data: state.user.data, error: null })
    );
    const [threadsResult, usersResult] = await Promise.allSettled([
      api.getAllThreads(),
      api.getAllUsers(),
    ]);

    dispatch(
      setThreadsActionCreator(
        threadsResult.status === 'fulfilled'
          ? { status: 'success', data: threadsResult.value, error: null }
          : {
              status: 'error',
              data: state.thread.data,
              error: (threadsResult.reason as Error).message,
            }
      )
    );
    dispatch(
      setUsersActionCreator(
        usersResult.status === 'fulfilled'
          ? { status: 'success', data: usersResult.value, error: null }
          : {
              status: 'error',
              data: state.user.data,
              error: (usersResult.reason as Error).message,
            }
      )
    );
  });
}
