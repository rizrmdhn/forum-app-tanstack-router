import { useOptimisticMutation } from '@/lib/optimistic-update';
import { useAppDispatch, useAppSelector } from '@/hooks/use-store';
import api from '@/lib/api';
import { threadKeys } from '@/lib/query-keys';
import type { IDetailThread } from '@/types';
import {
  setDetailThreadActionCreator,
  updateDetailThreadActionCreator,
} from '@/states/detail-thread/action';

type CommentVoteInput = {
  commentId: string;
  voteType: 'up' | 'down' | 'neutral';
};

export function useVoteComment(threadId: string) {
  const auth = useAppSelector((state) => state.auth);
  const { data: thread } = useAppSelector((state) => state.detailThread);
  const dispatch = useAppDispatch();

  function computeUpdatedComments(commentId: string, voteType: CommentVoteInput['voteType']) {
    const userId = auth!.id;
    const withoutUser = (ids: string[]) => ids.filter((id) => id !== userId);
    return (thread?.comments ?? []).map((comment) => {
      if (comment.id !== commentId) return comment;
      if (voteType === 'up')
        return {
          ...comment,
          upVotesBy: [...withoutUser(comment.upVotesBy), userId],
          downVotesBy: withoutUser(comment.downVotesBy),
        };
      if (voteType === 'down')
        return {
          ...comment,
          upVotesBy: withoutUser(comment.upVotesBy),
          downVotesBy: [...withoutUser(comment.downVotesBy), userId],
        };
      return {
        ...comment,
        upVotesBy: withoutUser(comment.upVotesBy),
        downVotesBy: withoutUser(comment.downVotesBy),
      };
    });
  }

  return useOptimisticMutation<void, Error, CommentVoteInput, IDetailThread>(
    {
      mutationFn: ({ commentId, voteType }) => {
        if (voteType === 'up') return api.upVoteComment({ threadId, commentId });
        if (voteType === 'down') return api.downVoteComment({ threadId, commentId });
        return api.neutralVoteComment({ threadId, commentId });
      },
    },
    {
      queryOptions: { queryKey: threadKeys.detail(threadId) },
      operation: {
        type: 'update',
        getId: () => threadId,
        getUpdatedFields: ({ commentId, voteType }) => ({
          comments: computeUpdatedComments(commentId, voteType),
        }),
      },
      onMutate: ({ commentId, voteType }) => {
        dispatch(
          updateDetailThreadActionCreator({
            comments: computeUpdatedComments(commentId, voteType),
          })
        );
      },
      onError: () => {
        if (thread) {
          dispatch(
            setDetailThreadActionCreator({ status: 'success', data: thread, error: null })
          );
        }
      },
    }
  );
}
