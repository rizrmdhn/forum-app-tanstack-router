export interface IUser {
  id: string
  name: string
  email: string
  avatar: string
}

export interface IThread {
  id: string
  title: string
  body: string
  category: string
  createdAt: string
  ownerId: string
  upVotesBy: string[]
  downVotesBy: string[]
  totalComments: number
}

export interface IComment {
  id: string
  content: string
  createdAt: string
  upVotesBy: string[]
  downVotesBy: string[]
  owner: IUser
}

export interface IDetailThread {
  id: string
  title: string
  body: string
  category: string
  createdAt: string
  owner: IUser
  upVotesBy: string[]
  downVotesBy: string[]
  comments: IComment[]
}

export interface IVote {
  id: string
  userId: string
  threadId: string
  voteType: 1 | 0 | -1
}

export interface ILeaderboard {
  user: IUser
  score: number
  isSvg?: boolean
}

export interface INewLeaderboard extends ILeaderboard {
  isSvg: boolean
}

export interface IAccessToken {
  accessToken: string | undefined
}

export interface ILoginResponse {
  status: string
  message: string
  data: {
    token: string
  }
}

export interface IRegisterUserResponse {
  status: string
  message: string
  data: {
    user: IUser
  }
}

export interface IGetAllUsersResponse {
  status: string
  message: string
  data: {
    users: IUser[]
  }
}

export interface IGetOwnProfileResponse {
  status: string
  message: string
  data: {
    user: IUser
  }
}

export interface IGetAllThreadsResponse {
  status: string
  message: string
  data: {
    threads: IThread[]
  }
}

export interface IGetDetailThreadResponse {
  status: string
  message: string
  data: {
    detailThread: IDetailThread
  }
}

export interface ICreateThreadResponse {
  status: string
  message: string
  data: {
    thread: IThread
  }
}

export interface ICreateCommentResponse {
  status: string
  message: string
  data: {
    comment: IComment
  }
}

export interface ICreateVoteResponse {
  status: string
  message: string
  data: {
    vote: IVote
  }
}

export interface IGetLeaderboardResponse {
  status: string
  message: string
  data: {
    leaderboards: ILeaderboard[]
  }
}
