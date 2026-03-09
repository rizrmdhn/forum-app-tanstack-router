import type { ActionInterface } from "@/types"
import type { AppDispatch } from "@/states"
import { receiveAuthUserActionCreator } from "@/states/auth/action"
import api from "@/lib/api"

const ActionType = {
  SET_IS_PRELOAD: "SET_IS_PRELOAD",
} as const

export type ActionType = (typeof ActionType)[keyof typeof ActionType]

type SetIsPreloadAction = ActionInterface<
  typeof ActionType.SET_IS_PRELOAD,
  { isPreload: boolean | null }
>

export type IsPreloadAction = SetIsPreloadAction

export function setIsPreloadActionCreator(
  isPreload: boolean | null
): SetIsPreloadAction {
  return { type: ActionType.SET_IS_PRELOAD, payload: { isPreload } }
}

export function asyncSetIsPreload() {
  return async (dispatch: AppDispatch) => {
    try {
      const authUser = await api.getOwnProfile()
      dispatch(receiveAuthUserActionCreator(authUser))
    } catch {
      dispatch(setIsPreloadActionCreator(null))
    } finally {
      dispatch(setIsPreloadActionCreator(false))
    }
  }
}
