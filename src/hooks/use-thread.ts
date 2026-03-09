import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useThread() {
  return useQuery({
    queryKey: threadKeys.lists(),
    queryFn: api.getAllThreads,
  })
}
