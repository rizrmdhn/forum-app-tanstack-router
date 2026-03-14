import type { ApiResponse } from './api';

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface IAccessToken {
  accessToken: string | undefined;
}

export type ILoginResponse = ApiResponse<{ token: string }>;

export type IRegisterUserResponse = ApiResponse<{ user: IUser }>;

export type IGetAllUsersResponse = ApiResponse<{ users: IUser[] }>;

export type IGetOwnProfileResponse = ApiResponse<{ user: IUser }>;
