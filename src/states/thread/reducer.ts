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
    case 'UPDATE_THREAD':
      if (state.status !== 'success' || !state.data) return state;
      return {
        ...state,
        data: state.data.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    default:
      return state;
  }
}
