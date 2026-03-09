import api from "@/lib/api"
import { userKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: api.getAllUsers,
  })
}
