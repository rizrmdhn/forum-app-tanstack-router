import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useThread(search?: string) {
  return useQuery({
    queryKey: threadKeys.lists(),
    queryFn: api.getAllThreads,
    select: (threads) =>
      search
        ? threads.filter((t) =>
            t.title.toLowerCase().includes(search.toLowerCase())
          )
        : threads,
  })
}
