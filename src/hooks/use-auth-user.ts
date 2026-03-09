import { useQuery } from "@tanstack/react-query"
import { useAppDispatch } from "@/hooks/use-store"
import { receiveAuthUserActionCreator } from "@/states/auth/action"
import api from "@/lib/api"
import { authUserKeys } from "@/lib/query-keys"

export function useAuthUser() {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: authUserKeys.profile(),
    queryFn: async () => {
      const user = await api.getOwnProfile()
      // Sync ke Redux setelah berhasil fetch
      dispatch(receiveAuthUserActionCreator(user))
      return user
    },
    staleTime: 5 * 60 * 1000, // cache 5 menit
    retry: false,
  })
}
