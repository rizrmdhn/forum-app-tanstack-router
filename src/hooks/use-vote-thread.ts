import { useQueryClient } from "@tanstack/react-query"
import { useOptimisticMutation } from "@/lib/optimistic-update"
import { useAppSelector } from "@/hooks/use-store"
import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import type { IDetailThread } from "@/types"

type ThreadVoteInput = "up" | "down" | "neutral"

export function useVoteThread(threadId: string) {
  const queryClient = useQueryClient()
  const auth = useAppSelector((state) => state.auth)

  return useOptimisticMutation<void, Error, ThreadVoteInput, IDetailThread>(
    {
      mutationFn: (voteType) => {
        if (voteType === "up") return api.upVoteThread(threadId)
        if (voteType === "down") return api.downVoteThread(threadId)
        return api.neutralVoteThread(threadId)
      },
    },
    {
      queryOptions: { queryKey: threadKeys.detail(threadId) },
      operation: {
        type: "update",
        getId: () => threadId,
        getUpdatedFields: (voteType) => {
          const existing = queryClient.getQueryData<IDetailThread>(
            threadKeys.detail(threadId)
          )
          const userId = auth!.id
          const withoutUser = (ids: string[]) => ids.filter((id) => id !== userId)
          if (voteType === "up") {
            return {
              upVotesBy: [...withoutUser(existing?.upVotesBy ?? []), userId],
              downVotesBy: withoutUser(existing?.downVotesBy ?? []),
            }
          }
          if (voteType === "down") {
            return {
              upVotesBy: withoutUser(existing?.upVotesBy ?? []),
              downVotesBy: [...withoutUser(existing?.downVotesBy ?? []), userId],
            }
          }
          return {
            upVotesBy: withoutUser(existing?.upVotesBy ?? []),
            downVotesBy: withoutUser(existing?.downVotesBy ?? []),
          }
        },
      },
    }
  )
}
