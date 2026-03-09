export const leaderboardKeys = {
  all: ["leaderboards"] as const,
  lists: () => [...leaderboardKeys.all, "list"] as const,
}
