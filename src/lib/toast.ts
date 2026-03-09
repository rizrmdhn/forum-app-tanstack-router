import { toast } from "sonner"

const SONNER_DEFAULT_TOAST_DURATION = 1500

const SONNER_WARNING_TOAST_DURATION = 3000

export const globalSuccessToast = (message: string) => toast.success("Success", {
    description: message,
    closeButton: true,
    duration: SONNER_DEFAULT_TOAST_DURATION,
  })

export const globalLoadingToast = (message: string) => toast.loading(message, {
    duration: Number.POSITIVE_INFINITY,
  })

export const dismissLoadingToast = (toastId: string | number) => {
  toast.dismiss(toastId) // Use toast ID to dismiss
}

export const globalErrorToast = (message: string, title?: string) => toast.error(title ?? "Error", {
    description: message,
    closeButton: true,
    duration: SONNER_DEFAULT_TOAST_DURATION,
  })

export const globalInfoToast = (message: string) => toast.info("Info", {
    description: message,
    closeButton: true,
    duration: SONNER_WARNING_TOAST_DURATION,
  })

export const globalWarningToast = (message: string) => toast.warning("Warning", {
    description: message,
    closeButton: true,
    duration: SONNER_WARNING_TOAST_DURATION,
  })
