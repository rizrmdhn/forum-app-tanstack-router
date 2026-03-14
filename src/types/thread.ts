import type { ApiResponse } from './api';
import type { IUser } from './user';

export interface IThread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  upVotesBy: string[];
  downVotesBy: string[];
  owner: IUser;
}

export interface IDetailThread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  owner: IUser;
  upVotesBy: string[];
  downVotesBy: string[];
  comments: IComment[];
}

export type IGetAllThreadsResponse = ApiResponse<{ threads: IThread[] }>;

export type IGetDetailThreadResponse = ApiResponse<{
  detailThread: IDetailThread;
}>;

export type ICreateThreadResponse = ApiResponse<{ thread: IThread }>;

export type ICreateCommentResponse = ApiResponse<{ comment: IComment }>;
