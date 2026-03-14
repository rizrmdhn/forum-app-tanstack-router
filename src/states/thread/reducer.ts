import type { StateInterface, IThread } from '@/types';
import type { ThreadAction } from './action';

const intialState: StateInterface<IThread[]> = {
  status: 'loading',
  data: null,
  error: null,
};

export default function threadReducer(
  state: StateInterface<IThread[]> = intialState,
  action: ThreadAction
): StateInterface<IThread[]> {
  switch (action.type) {
    case 'SET_THREADS':
      return action.payload;
    default:
      return state;
  }
}
