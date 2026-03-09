import { type IsPreloadAction } from "./action"

export type IsPreloadState = boolean | null

const initialState: IsPreloadState = true

export default function isPreloadReducer(
  state: IsPreloadState = initialState,
  action: IsPreloadAction
): IsPreloadState {
  switch (action.type) {
    case "SET_IS_PRELOAD":
      return action.payload.isPreload
    default:
      return state
  }
}
