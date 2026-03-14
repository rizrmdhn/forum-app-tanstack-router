import { useEffect } from 'react';
import type { AppDispatch, RootState } from '@/states';
import { useAppDispatch } from './use-store';

type Thunk = (
  dispatch: AppDispatch,
  getState: () => RootState
) => void | Promise<void>;

export function useDispatchOnMount(...thunks: Thunk[]) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    thunks.forEach((thunk) => dispatch(thunk));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
}
