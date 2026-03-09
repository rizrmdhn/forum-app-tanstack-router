import { useQueryClient } from "@tanstack/react-query"
import { useOptimisticMutation } from "@/lib/optimistic-update"
import { useAppSelector } from "@/hooks/use-store"
import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import type { IDetailThread } from "@/types"

type CommentVoteInput = {
  commentId: string
  voteType: "up" | "down" | "neutral"
}

export function useVoteComment(threadId: string) {
  const queryClient = useQueryClient()
  const auth = useAppSelector((state) => state.auth)

  return useOptimisticMutation<void, Error, CommentVoteInput, IDetailThread>(
    {
      mutationFn: ({ commentId, voteType }) => {
        if (voteType === "up") return api.upVoteComment({ threadId, commentId })
        if (voteType === "down") return api.downVoteComment({ threadId, commentId })
        return api.neutralVoteComment({ threadId, commentId })
      },
    },
    {
      queryOptions: { queryKey: threadKeys.detail(threadId) },
      operation: {
        type: "update",
        getId: () => threadId,
        getUpdatedFields: ({ commentId, voteType }) => {
          const existing = queryClient.getQueryData<IDetailThread>(
            threadKeys.detail(threadId)
          )
          const userId = auth!.id
          const updatedComments = (existing?.comments ?? []).map((comment) => {
            if (comment.id !== commentId) return comment
            const withoutUser = (ids: string[]) => ids.filter((id) => id !== userId)
            if (voteType === "up") {
              return {
                ...comment,
                upVotesBy: [...withoutUser(comment.upVotesBy), userId],
                downVotesBy: withoutUser(comment.downVotesBy),
              }
            }
            if (voteType === "down") {
              return {
                ...comment,
                upVotesBy: withoutUser(comment.upVotesBy),
                downVotesBy: [...withoutUser(comment.downVotesBy), userId],
              }
            }
            return {
              ...comment,
              upVotesBy: withoutUser(comment.upVotesBy),
              downVotesBy: withoutUser(comment.downVotesBy),
            }
          })
          return { comments: updatedComments }
        },
      },
    }
  )
}
