import { useRef } from 'react';
import { useOptimisticMutation } from '@/lib/optimistic-update';
import { useAppDispatch, useAppSelector } from '@/hooks/use-store';
import api from '@/lib/api';
import { threadKeys } from '@/lib/query-keys';
import { globalErrorToast, globalSuccessToast } from '@/lib/toast';
import type { IComment, IDetailThread } from '@/types';
import {
  setDetailThreadActionCreator,
  updateDetailThreadActionCreator,
} from '@/states/detail-thread/action';

export function useCreateComment(threadId: string) {
  const auth = useAppSelector((state) => state.auth);
  const { data: thread } = useAppSelector((state) => state.detailThread);
  const dispatch = useAppDispatch();
  const optimisticIdRef = useRef<string | null>(null);

  return useOptimisticMutation<IComment, Error, string, IDetailThread>(
    {
      mutationFn: (content: string) => api.createComment({ threadId, content }),
    },
    {
      queryOptions: { queryKey: threadKeys.detail(threadId) },
      operation: {
        type: 'update',
        getId: () => threadId,
        getUpdatedFields: () => ({}),
      },
      onMutate: (content) => {
        const optimisticId = `optimistic-${Date.now()}`;
        optimisticIdRef.current = optimisticId;
        const optimisticComment: IComment = {
          id: optimisticId,
          content,
          createdAt: new Date().toISOString(),
          upVotesBy: [],
          downVotesBy: [],
          owner: auth!,
        };
        dispatch(
          updateDetailThreadActionCreator({
            comments: [...(thread?.comments ?? []), optimisticComment],
          })
        );
      },
      onSuccess: (realComment) => {
        if (optimisticIdRef.current && thread) {
          const updatedComments = (thread.comments ?? []).map((c) =>
            c.id === optimisticIdRef.current ? realComment : c
          );
          dispatch(
            updateDetailThreadActionCreator({ comments: updatedComments })
          );
          optimisticIdRef.current = null;
        }
        globalSuccessToast('Komentar berhasil dikirim!');
      },
      onError: (error) => {
        if (thread) {
          dispatch(
            setDetailThreadActionCreator({
              status: 'success',
              data: thread,
              error: null,
            })
          );
        }
        globalErrorToast(`Gagal mengirim komentar: ${error.message}`);
      },
    }
  );
}
