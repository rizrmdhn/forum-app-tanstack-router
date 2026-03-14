import type { StateInterface, ILeaderboard } from '@/types';
import type { LeaderboardAction } from './action';

const intialState: StateInterface<ILeaderboard[]> = {
  status: 'loading',
  data: null,
  error: null,
};

export default function leaderboardReducer(
  state: StateInterface<ILeaderboard[]> = intialState,
  action: LeaderboardAction
): StateInterface<ILeaderboard[]> {
  switch (action.type) {
    case 'SET_LEADERBOARD':
      return action.payload;
    default:
      return state;
  }
}
