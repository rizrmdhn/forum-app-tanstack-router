import { useRef } from 'react';
import { useOptimisticMutation } from '@/lib/optimistic-update';
import { useAppDispatch, useAppSelector } from '@/hooks/use-store';
import api from '@/lib/api';
import { threadKeys } from '@/lib/query-keys';
import { globalSuccessToast, globalErrorToast } from '@/lib/toast';
import type { CreateThreadInput } from '@/lib/schemas/thread.schema';
import type { IThread } from '@/types';
import {
  addThreadActionCreator,
  replaceThreadActionCreator,
  setThreadsActionCreator,
} from '@/states/thread/action';

export function useCreateThread() {
  const auth = useAppSelector((state) => state.auth);
  const { data: threads } = useAppSelector((state) => state.thread);
  const dispatch = useAppDispatch();
  const optimisticIdRef = useRef<string | null>(null);

  return useOptimisticMutation<IThread, Error, CreateThreadInput, IThread[]>(
    { mutationFn: (input) => api.createThread(input) },
    {
      queryOptions: { queryKey: threadKeys.lists() },
      operation: {
        type: 'create',
        getOptimisticItem: ({ title, body, category }) => ({
          id: `optimistic-${Date.now()}`,
          title,
          body,
          category: category ?? '',
          createdAt: new Date().toISOString(),
          ownerId: auth!.id,
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        }),
      },
      onMutate: ({ title, body, category }) => {
        const optimisticId = `optimistic-${Date.now()}`;
        optimisticIdRef.current = optimisticId;
        dispatch(
          addThreadActionCreator({
            id: optimisticId,
            title,
            body,
            category: category ?? '',
            createdAt: new Date().toISOString(),
            ownerId: auth!.id,
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0,
          })
        );
      },
      onSuccess: (realThread) => {
        if (optimisticIdRef.current) {
          dispatch(replaceThreadActionCreator(optimisticIdRef.current, realThread));
          optimisticIdRef.current = null;
        }
        globalSuccessToast('Thread berhasil dibuat');
      },
      onError: (error) => {
        if (threads) {
          dispatch(
            setThreadsActionCreator({ status: 'success', data: threads, error: null })
          );
        }
        globalErrorToast(`Gagal membuat thread: ${error.message}`);
      },
    }
  )
}
