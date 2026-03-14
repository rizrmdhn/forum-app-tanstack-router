import { BottomNavBar } from '@/components/bottom-nav-bar';
import {
  LeaderboardCard,
  LeaderboardCardSkeleton,
} from '@/components/leaderboard-card';
import { useDispatchOnMount } from '@/hooks/use-dispatch-on-mount';
import { useAppSelector } from '@/hooks/use-store';
import { asyncLoadLeaderboard } from '@/states/leaderboard/action';
import { createFileRoute } from '@tanstack/react-router';

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `leaderboard-skeleton-${i}`);

export const Route = createFileRoute('/leaderboards')({
  component: LeaderboardsComponent,
});

function LeaderboardsComponent() {
  useDispatchOnMount(asyncLoadLeaderboard());

  const { data: leaderboards, status } = useAppSelector(
    (state) => state.leaderboard
  );

  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      <nav className="flex h-navbar items-center justify-center border-b bg-primary px-4 text-primary-foreground">
        <p className="font-semibold">Klasemen Pengguna Aktif</p>
      </nav>
      <div className="mx-auto w-full max-w-2xl space-y-2 overflow-y-auto p-4">
        {status === 'loading'
          ? SKELETON_KEYS.map((key) => <LeaderboardCardSkeleton key={key} />)
          : leaderboards?.map((entry, index, arr) => {
              const rank =
                index > 0 && arr[index - 1]!.score === entry.score
                  ? arr.findIndex((e) => e.score === entry.score) + 1
                  : index + 1;
              return (
                <LeaderboardCard key={entry.user.id} entry={entry} rank={rank} />
              );
            })}
      </div>
      <BottomNavBar />
    </div>
  );
}
