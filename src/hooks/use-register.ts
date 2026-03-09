import { useRouter } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { globalErrorToast, globalSuccessToast } from "@/lib/toast"

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => api.register({ name, email, password }),
    onSuccess: () => {
      globalSuccessToast("Registrasi berhasil, silakan login")
      router.navigate({ to: "/login" })
    },
    onError: (error) => {
      globalErrorToast(
        `Registrasi gagal: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    },
  })
}
