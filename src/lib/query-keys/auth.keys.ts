export const authUserKeys = {
  all: ["authUser"] as const,
  profile: () => [...authUserKeys.all, "profile"] as const,
}
