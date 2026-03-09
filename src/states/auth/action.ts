import type { IUser } from "@/types"

const ActionType = {
  RECEIVE_AUTH_USER: "RECEIVE_AUTH_USER",
  UNSET_AUTH_USER: "UNSET_AUTH_USER",
} as const

export type ActionType = (typeof ActionType)[keyof typeof ActionType]

interface ReceiveAuthUserAction {
  type: typeof ActionType.RECEIVE_AUTH_USER
  payload: { authUser: IUser }
  [key: string]: unknown
}

interface UnsetAuthUserAction {
  type: typeof ActionType.UNSET_AUTH_USER
  [key: string]: unknown
}

export type AuthUserAction = ReceiveAuthUserAction | UnsetAuthUserAction

// Action creators murni — tidak ada thunk, tidak ada async
export function receiveAuthUserActionCreator(
  authUser: IUser
): ReceiveAuthUserAction {
  return { type: ActionType.RECEIVE_AUTH_USER, payload: { authUser } }
}

export function unsetAuthUserActionCreator(): UnsetAuthUserAction {
  return { type: ActionType.UNSET_AUTH_USER }
}
