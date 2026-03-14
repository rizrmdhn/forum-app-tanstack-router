import type { AppDispatch } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';
import { setThreadsActionCreator } from '../thread/action';
import { setUsersActionCreator } from '../user/action';

export function asyncLoadThreadsAndUsers() {
  return asyncHandler<AppDispatch>(async (dispatch) => {
    dispatch(
      setThreadsActionCreator({ status: 'loading', data: null, error: null })
    );
    dispatch(
      setUsersActionCreator({ status: 'loading', data: null, error: null })
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
              data: null,
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
              data: null,
              error: (usersResult.reason as Error).message,
            }
      )
    );
  });
}
