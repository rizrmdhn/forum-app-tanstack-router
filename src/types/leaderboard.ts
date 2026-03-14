import type { ApiResponse } from './api';
import type { IUser } from './user';

export interface ILeaderboard {
  user: IUser;
  score: number;
  isSvg?: boolean;
}

export interface INewLeaderboard extends ILeaderboard {
  isSvg: boolean;
}

export type IGetLeaderboardResponse = ApiResponse<{
  leaderboards: ILeaderboard[];
}>;
