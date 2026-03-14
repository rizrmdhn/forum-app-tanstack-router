import type { StateInterface, IDetailThread } from '@/types';
import type { DetailThreadAction } from './action';

const intialState: StateInterface<IDetailThread> = {
  status: 'loading',
  data: null,
  error: null,
};

export default function detailThreadReducer(
  state: StateInterface<IDetailThread> = intialState,
  action: DetailThreadAction
): StateInterface<IDetailThread> {
  switch (action.type) {
    case 'SET_DETAIL_THREAD':
      return action.payload;
    case 'UPDATE_DETAIL_THREAD':
      if (state.status !== 'success' || !state.data) return state;
      return { ...state, data: { ...state.data, ...action.payload } };
    default:
      return state;
  }
}
