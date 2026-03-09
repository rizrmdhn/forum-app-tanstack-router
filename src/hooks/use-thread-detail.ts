import api from "@/lib/api"
import { threadKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useThreadDetail(id: string) {
  return useQuery({
    queryKey: threadKeys.detail(id),
    queryFn: () => api.getThreadById(id),
  })
}
