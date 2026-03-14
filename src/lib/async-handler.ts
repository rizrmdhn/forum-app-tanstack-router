type ThunkFn<D> = (dispatch: D) => Promise<void>

interface AsyncHandlerOptions<D> {
  onError?: (dispatch: D, error: unknown) => void
  onFinally?: (dispatch: D) => void
}

export function asyncHandler<D>(
  fn: ThunkFn<D>,
  options: AsyncHandlerOptions<D> = {}
): ThunkFn<D> {
  return async (dispatch: D) => {
    try {
      await fn(dispatch)
    } catch (error) {
      options.onError?.(dispatch, error)
    } finally {
      options.onFinally?.(dispatch)
    }
  }
}
