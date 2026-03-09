import { QueryCache, QueryClient } from "@tanstack/react-query"
import { globalErrorToast } from "./toast"

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      globalErrorToast(error.message || "An unexpected error occurred")
    },
  }),
})
