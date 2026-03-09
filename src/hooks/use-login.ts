import { useRouter } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { receiveAuthUserActionCreator } from "@/states/auth/action"
import { globalErrorToast, globalSuccessToast } from "@/lib/toast"
import { useAppDispatch } from "./use-store"

export function useLogin() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      await api.login({ email, password })
      return api.getOwnProfile()
    },
    onSuccess: (user) => {
      // Server state berhasil → sync ke Redux
      dispatch(receiveAuthUserActionCreator(user))
      globalSuccessToast("Login berhasil")
      router.navigate({
        to: "/",
      })
    },
    onError: (error) => {
      globalErrorToast(
        `Login gagal: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    },
  })
}
