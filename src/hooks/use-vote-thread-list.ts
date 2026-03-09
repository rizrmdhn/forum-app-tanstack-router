import { useQueryClient } from "@tanstack/react-query"
import { useOptimisticMutation } from "@/lib/optimistic-update"
import { useAppSelector } from "@/hooks/use-store"
import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import type { IThread } from "@/types"

type ThreadListVoteInput = {
  threadId: string
  voteType: "up" | "down" | "neutral"
}

export function useVoteThreadList() {
  const queryClient = useQueryClient()
  const auth = useAppSelector((state) => state.auth)

  return useOptimisticMutation<void, Error, ThreadListVoteInput, IThread[]>(
    {
      mutationFn: ({ threadId, voteType }) => {
        if (voteType === "up") return api.upVoteThread(threadId)
        if (voteType === "down") return api.downVoteThread(threadId)
        return api.neutralVoteThread(threadId)
      },
    },
    {
      queryOptions: { queryKey: threadKeys.lists() },
      operation: {
        type: "update",
        getId: ({ threadId }) => threadId,
        getUpdatedFields: ({ threadId, voteType }) => {
          const threads = queryClient.getQueryData<IThread[]>(threadKeys.lists())
          const thread = threads?.find((t) => t.id === threadId)
          const userId = auth!.id
          const withoutUser = (ids: string[]) => ids.filter((id) => id !== userId)
          if (voteType === "up") {
            return {
              upVotesBy: [...withoutUser(thread?.upVotesBy ?? []), userId],
              downVotesBy: withoutUser(thread?.downVotesBy ?? []),
            }
          }
          if (voteType === "down") {
            return {
              upVotesBy: withoutUser(thread?.upVotesBy ?? []),
              downVotesBy: [...withoutUser(thread?.downVotesBy ?? []), userId],
            }
          }
          return {
            upVotesBy: withoutUser(thread?.upVotesBy ?? []),
            downVotesBy: withoutUser(thread?.downVotesBy ?? []),
          }
        },
      },
    }
  )
}
