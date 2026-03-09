import type { IUser } from "@/types"
import type { AuthUserAction } from "./action"

export type IState = IUser | null

const initialState: IState = null

function authReducer(
  state: IState = initialState,
  action: AuthUserAction
): IState {
  switch (action.type) {
    case "RECEIVE_AUTH_USER":
      return action.payload.authUser
    case "UNSET_AUTH_USER":
      return null
    default:
      return state
  }
}

export default authReducer
