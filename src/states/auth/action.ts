import type { ActionInterface, IUser } from "@/types"
import type { AppDispatch } from "@/states"
import api from "@/lib/api"

const ActionType = {
  RECEIVE_AUTH_USER: "RECEIVE_AUTH_USER",
  UNSET_AUTH_USER: "UNSET_AUTH_USER",
} as const

export type ActionType = (typeof ActionType)[keyof typeof ActionType]

type ReceiveAuthUserAction = ActionInterface<
  typeof ActionType.RECEIVE_AUTH_USER,
  { authUser: IUser }
>

type UnsetAuthUserAction = ActionInterface<typeof ActionType.UNSET_AUTH_USER>

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

export function asyncLogin({
  email,
  password,
}: {
  email: string
  password: string
}) {
  return async (dispatch: AppDispatch) => {
    await api.login({ email, password })
    const authUser = await api.getOwnProfile()
    dispatch(receiveAuthUserActionCreator(authUser))
  }
}

export function asyncLogout() {
  return (dispatch: AppDispatch) => {
    api.putAccessToken("")
    dispatch(unsetAuthUserActionCreator())
  }
}
