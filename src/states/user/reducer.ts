import type { StateInterface, IUser } from '@/types';
import type { UserAction } from './action';

const intialState: StateInterface<IUser[]> = {
  status: 'loading',
  data: null,
  error: null,
};

export default function userReducer(
  state: StateInterface<IUser[]> = intialState,
  action: UserAction
): StateInterface<IUser[]> {
  switch (action.type) {
    case 'SET_USERS':
      return action.payload;
    default:
      return state;
  }
}
