import api from "@/lib/api"
import { leaderboardKeys } from "@/lib/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useLeaderboards() {
  return useQuery({
    queryKey: leaderboardKeys.lists(),
    queryFn: api.getLeaderboards,
  })
}
