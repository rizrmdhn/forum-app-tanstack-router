import { useQueryClient } from "@tanstack/react-query"
import { useOptimisticMutation } from "@/lib/optimistic-update"
import { useAppSelector } from "@/hooks/use-store"
import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import { globalErrorToast } from "@/lib/toast"
import type { IComment, IDetailThread } from "@/types"

export function useCreateComment(threadId: string) {
  const queryClient = useQueryClient()
  const auth = useAppSelector((state) => state.auth)

  return useOptimisticMutation<IComment, Error, string, IDetailThread>(
    { mutationFn: (content: string) => api.createComment({ threadId, content }) },
    {
      queryOptions: { queryKey: threadKeys.detail(threadId) },
      operation: {
        type: "update",
        getId: () => threadId,
        getUpdatedFields: (content) => {
          const existing = queryClient.getQueryData<IDetailThread>(
            threadKeys.detail(threadId)
          )
          const optimisticComment: IComment = {
            id: `optimistic-${Date.now()}`,
            content,
            createdAt: new Date().toISOString(),
            upVotesBy: [],
            downVotesBy: [],
            owner: auth!,
          }
          return { comments: [...(existing?.comments ?? []), optimisticComment] }
        },
      },
      onError: (error) => {
        globalErrorToast(`Gagal mengirim komentar: ${error.message}`)
      },
    }
  )
}
