import { ThreadCard, ThreadCardSkeleton } from '@/components/thread-card';
import { CreateThreadDialog } from '@/components/create-thread-dialog';
import { useVoteThreadList } from '@/hooks/use-vote-thread-list';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { NavBar } from '@/components/nav-bar';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { LayoutList } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDispatchOnMount } from '@/hooks/use-dispatch-on-mount';
import { asyncLoadThreadsAndUsers } from '@/states/shared/action';
import { useAppSelector } from '../hooks/use-store';

const SKELETON_KEYS = Array.from(
  { length: 6 },
  (_, i) => `thread-skeleton-${i}`
);

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    search: z.string().optional(),
    categories: z.array(z.string()).optional(),
  }),
  component: HomeComponent,
});

function HomeComponent() {
  useDispatchOnMount(asyncLoadThreadsAndUsers());

  const { search, categories } = Route.useSearch();
  const auth = useAppSelector((state) => state.auth);
  const { data: threads, status } = useAppSelector((state) => state.thread);
  const { data: users, status: usersStatus } = useAppSelector(
    (state) => state.user
  );
  const { mutate: voteThread } = useVoteThreadList();

  const isLoading = status === 'loading' || usersStatus === 'loading';
  const isEmpty = !isLoading && threads?.length === 0;

  const filteredThreads = threads?.filter((thread) => {
    const matchesSearch = thread.title
      .toLowerCase()
      .includes(search?.toLowerCase() ?? '');
    const matchesCategory = categories
      ? categories.includes(thread.category)
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      <NavBar />
      <ScrollArea className="min-h-0">
        <div className="mx-auto max-w-2xl space-y-4 p-4">
          {isLoading
            ? SKELETON_KEYS.map((key) => <ThreadCardSkeleton key={key} />)
            : filteredThreads?.map((thread) => {
                const owner = users?.find((u) => u.id === thread.ownerId);
                return (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    enableVote={!!auth}
                    currentUserId={auth?.id}
                    ownerName={owner?.name}
                    ownerAvatar={owner?.avatar}
                    onUpVote={(id) =>
                      voteThread({ threadId: id, voteType: 'up' })
                    }
                    onDownVote={(id) =>
                      voteThread({ threadId: id, voteType: 'down' })
                    }
                    onNeutralVote={(id) =>
                      voteThread({ threadId: id, voteType: 'neutral' })
                    }
                  />
                );
              })}
          {isEmpty && (
            <Empty className="mt-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LayoutList />
                </EmptyMedia>
                <EmptyTitle>Tidak ada thread</EmptyTitle>
                <EmptyDescription>
                  {search
                    ? `Tidak ada thread yang cocok dengan "${search}".`
                    : 'Belum ada thread yang dibuat.'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </ScrollArea>
      {auth && <CreateThreadDialog />}
      <BottomNavBar />
    </div>
  );
}
