type ThunkFn<D, S> = (dispatch: D, getState: () => S) => Promise<void>;

interface AsyncHandlerOptions<D, S> {
  onError?: (dispatch: D, error: unknown, getState: () => S) => void;
  onFinally?: (dispatch: D) => void;
}

export function asyncHandler<D, S>(
  fn: ThunkFn<D, S>,
  options: AsyncHandlerOptions<D, S> = {}
): ThunkFn<D, S> {
  return async (dispatch: D, getState: () => S) => {
    try {
      await fn(dispatch, getState);
    } catch (error) {
      options.onError?.(dispatch, error, getState);
    } finally {
      options.onFinally?.(dispatch);
    }
  };
}
