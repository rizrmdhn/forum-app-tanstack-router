import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { unsetAuthUserActionCreator } from "@/states/auth/action"
import { useAppDispatch } from "./use-store"

export function useLogout() {
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async () => {
      api.putAccessToken("")
    },
    onSuccess: () => {
      // Bersihkan Redux
      dispatch(unsetAuthUserActionCreator())
    },
  })
}
