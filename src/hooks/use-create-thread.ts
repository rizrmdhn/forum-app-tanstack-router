import { useOptimisticMutation } from "@/lib/optimistic-update"
import { useAppSelector } from "@/hooks/use-store"
import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import { globalSuccessToast, globalErrorToast } from "@/lib/toast"
import type { CreateThreadInput } from "@/lib/schemas/thread.schema"
import type { IThread } from "@/types"

export function useCreateThread() {
  const auth = useAppSelector((state) => state.auth)

  return useOptimisticMutation<IThread, Error, CreateThreadInput, IThread[]>(
    { mutationFn: (input) => api.createThread(input) },
    {
      queryOptions: { queryKey: threadKeys.lists() },
      operation: {
        type: "create",
        getOptimisticItem: ({ title, body, category }) => ({
          id: `optimistic-${Date.now()}`,
          title,
          body,
          category: category ?? "",
          createdAt: new Date().toISOString(),
          ownerId: auth!.id,
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        }),
      },
      onSuccess: () => { globalSuccessToast("Thread berhasil dibuat") },
      onError: (error) => { globalErrorToast(`Gagal membuat thread: ${error.message}`) },
    }
  )
}
