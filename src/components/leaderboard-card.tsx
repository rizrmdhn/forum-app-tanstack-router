import type { ILeaderboard } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Skeleton } from "./ui/skeleton"

interface LeaderboardCardProps {
  entry: ILeaderboard
  rank: number
}

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-slate-400",
  3: "text-amber-600",
}

export function LeaderboardCard({ entry, rank }: LeaderboardCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
      <span
        className={`w-6 shrink-0 text-center text-sm font-bold ${rankColors[rank] ?? "text-muted-foreground"}`}
      >
        {rank}
      </span>
      <Avatar>
        <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
        <AvatarFallback>{entry.user.name[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {entry.user.name}
      </span>
      <span className="shrink-0 text-sm font-semibold tabular-nums">
        {entry.score} pts
      </span>
    </div>
  )
}

export function LeaderboardCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
      <Skeleton className="size-6 rounded-full" />
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-4 flex-1 rounded" />
      <Skeleton className="h-4 w-12 rounded" />
    </div>
  )
}
