export const threadKeys = {
  all: ["threads"] as const,
  lists: () => [...threadKeys.all, "list"] as const,
  detail: (threadId: string) => [...threadKeys.all, "detail", threadId] as const,
  comments: (threadId: string) => [...threadKeys.all, "detail", threadId, "comments"] as const,
}
