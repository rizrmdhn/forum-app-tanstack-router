export const authUserKeys = {
  all: ["auth-user"] as const,
  profile: () => [...authUserKeys.all, "profile"] as const,
}
