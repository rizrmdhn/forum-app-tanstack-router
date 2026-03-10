import { BottomNavBar } from '@/components/bottom-nav-bar';
import {
  LeaderboardCard,
  LeaderboardCardSkeleton,
} from '@/components/leaderboard-card';
import { useLeaderboards } from '@/hooks/use-leaderboars';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/leaderboards')({
  component: LeaderboardsComponent,
});

function LeaderboardsComponent() {
  const { data: leaderboards, isLoading } = useLeaderboards();

  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      <nav className="flex items-center justify-center border-b bg-primary p-4 text-primary-foreground">
        <p className="font-semibold">Klasemen Pengguna Aktif</p>
      </nav>
      <div className="mx-auto w-full max-w-2xl space-y-2 overflow-y-auto p-4">
        {isLoading
          ? Array.from({ length: 8 }).map(() => <LeaderboardCardSkeleton />)
          : leaderboards?.map((entry, index) => (
              <LeaderboardCard
                key={entry.user.id}
                entry={entry}
                rank={index + 1}
              />
            ))}
      </div>
      <BottomNavBar />
    </div>
  );
}
