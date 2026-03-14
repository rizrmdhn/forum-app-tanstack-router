import type { ActionInterface, StateInterface, ILeaderboard } from '@/types';
import type { AppDispatch, RootState } from '@/states';
import api from '@/lib/api';
import { asyncHandler } from '@/lib/async-handler';

const ActionType = {
  SET_LEADERBOARD: 'SET_LEADERBOARD',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

type SetLeaderboardAction = ActionInterface<
  typeof ActionType.SET_LEADERBOARD,
  StateInterface<ILeaderboard[]>
>;

export type LeaderboardAction = SetLeaderboardAction;

export function setLeaderboardActionCreator(
  state: StateInterface<ILeaderboard[]>
): SetLeaderboardAction {
  return { type: ActionType.SET_LEADERBOARD, payload: state };
}

export function asyncLoadLeaderboard() {
  return asyncHandler<AppDispatch, RootState>(
    async (dispatch, getState) => {
      const state = getState();
      dispatch(
        setLeaderboardActionCreator({
          status: 'loading',
          data: state.leaderboard.data,
          error: null,
        })
      );
      const leaderboard = await api.getLeaderboards();
      dispatch(
        setLeaderboardActionCreator({
          status: 'success',
          data: leaderboard,
          error: null,
        })
      );
    },
    {
      onError: (dispatch, error) =>
        dispatch(
          setLeaderboardActionCreator({
            status: 'error',
            data: null,
            error: (error as Error).message,
          })
        ),
    }
  );
}
