import { useOptimisticMutation } from '@/lib/optimistic-update';
import { useAppDispatch, useAppSelector } from '@/hooks/use-store';
import api from '@/lib/api';
import { threadKeys } from '@/lib/query-keys';
import type { IDetailThread } from '@/types';
import {
  setDetailThreadActionCreator,
  updateDetailThreadActionCreator,
} from '@/states/detail-thread/action';

type ThreadVoteInput = 'up' | 'down' | 'neutral';

export function useVoteThread(threadId: string) {
  const auth = useAppSelector((state) => state.auth);
  const { data: thread } = useAppSelector((state) => state.detailThread);
  const dispatch = useAppDispatch();

  function computeVoteFields(voteType: ThreadVoteInput): Partial<IDetailThread> {
    const userId = auth!.id;
    const withoutUser = (ids: string[]) => ids.filter((id) => id !== userId);

    if (voteType === 'up')
      return {
        upVotesBy: [...withoutUser(thread?.upVotesBy ?? []), userId],
        downVotesBy: withoutUser(thread?.downVotesBy ?? []),
      };
    if (voteType === 'down')
      return {
        upVotesBy: withoutUser(thread?.upVotesBy ?? []),
        downVotesBy: [...withoutUser(thread?.downVotesBy ?? []), userId],
      };
    return {
      upVotesBy: withoutUser(thread?.upVotesBy ?? []),
      downVotesBy: withoutUser(thread?.downVotesBy ?? []),
    };
  }

  return useOptimisticMutation<void, Error, ThreadVoteInput, IDetailThread>(
    {
      mutationFn: (voteType) => {
        if (voteType === 'up') return api.upVoteThread(threadId);
        if (voteType === 'down') return api.downVoteThread(threadId);
        return api.neutralVoteThread(threadId);
      },
    },
    {
      queryOptions: { queryKey: threadKeys.detail(threadId) },
      operation: {
        type: 'update',
        getId: () => threadId,
        getUpdatedFields: (voteType) => computeVoteFields(voteType),
      },
      onMutate: (voteType) => {
        dispatch(updateDetailThreadActionCreator(computeVoteFields(voteType)));
      },
      onError: () => {
        if (thread) {
          dispatch(
            setDetailThreadActionCreator({
              status: 'success',
              data: thread,
              error: null,
            })
          );
        }
      },
    }
  );
}
