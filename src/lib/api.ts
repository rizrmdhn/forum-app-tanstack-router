import type { IComment, IDetailThread, ILeaderboard, IThread, IUser } from "@/types"

const BASE_URL = "https://forum-api.dicoding.dev/v1"

function getAccessToken() {
  return localStorage.getItem("accessToken")
}

function putAccessToken(token: string) {
  localStorage.setItem("accessToken", token)
}

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options)
  const json = await res.json()
  if (json.status !== "success") throw new Error(json.message as string)
  return json.data
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return fetchJSON(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })
}

function jsonBody(body: object): RequestInit {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }
}

async function register({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  await fetchJSON(`${BASE_URL}/register`, {
    method: "POST",
    ...jsonBody({ name, email, password }),
  })
}

async function login({ email, password }: { email: string; password: string }) {
  const data = await fetchJSON(`${BASE_URL}/login`, {
    method: "POST",
    ...jsonBody({ email, password }),
  })
  putAccessToken(data.token as string)
}

async function getOwnProfile(): Promise<IUser> {
  const data = await fetchWithAuth(`${BASE_URL}/users/me`)
  return data.user as IUser
}

async function getAllUsers(): Promise<IUser[]> {
  const data = await fetchJSON(`${BASE_URL}/users`)
  return data.users as IUser[]
}

async function getAllThreads(): Promise<IThread[]> {
  const data = await fetchJSON(`${BASE_URL}/threads`)
  return data.threads as IThread[]
}

async function getThreadById(threadId: string): Promise<IDetailThread> {
  const data = await fetchJSON(`${BASE_URL}/threads/${threadId}`)
  return data.detailThread as IDetailThread
}

async function createThread({
  title,
  body,
  category = "",
}: {
  title: string
  body: string
  category?: string
}): Promise<IThread> {
  const data = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: "POST",
    ...jsonBody({ title, body, category }),
  })
  return data.thread as IThread
}

async function createComment({
  threadId,
  content,
}: {
  threadId: string
  content: string
}): Promise<IComment> {
  const data = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments`,
    { method: "POST", ...jsonBody({ content }) }
  )
  return data.comment as IComment
}

async function upVoteThread(threadId: string) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, {
    method: "POST",
  })
}

async function downVoteThread(threadId: string) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, {
    method: "POST",
  })
}

async function neutralVoteThread(threadId: string) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
    method: "POST",
  })
}

async function upVoteComment({
  threadId,
  commentId,
}: {
  threadId: string
  commentId: string
}) {
  await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    { method: "POST" }
  )
}

async function downVoteComment({
  threadId,
  commentId,
}: {
  threadId: string
  commentId: string
}) {
  await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    { method: "POST" }
  )
}

async function neutralVoteComment({
  threadId,
  commentId,
}: {
  threadId: string
  commentId: string
}) {
  await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    { method: "POST" }
  )
}

async function getLeaderboards(): Promise<ILeaderboard[]> {
  const data = await fetchJSON(`${BASE_URL}/leaderboards`)
  return data.leaderboards as ILeaderboard[]
}

const api = {
  putAccessToken,
  getAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadById,
  createThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
  getLeaderboards,
}

export default api
