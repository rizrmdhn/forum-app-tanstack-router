import type { ApiResponse } from './api';

export interface IVote {
  id: string;
  userId: string;
  threadId: string;
  voteType: 1 | 0 | -1;
}

export type ICreateVoteResponse = ApiResponse<{ vote: IVote }>;
