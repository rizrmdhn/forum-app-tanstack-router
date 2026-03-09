import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useThread(search?: string, category?: string[]) {
  return useQuery({
    queryKey: threadKeys.lists(),
    queryFn: api.getAllThreads,
    select: (threads) =>
      threads.filter((thread) => {
        const matchesSearch = thread.title
          .toLowerCase()
          .includes(search?.toLowerCase() ?? "")
        const matchesCategory = category
          ? category.includes(thread.category)
          : true
        return matchesSearch && matchesCategory
      }),
  })
}
