import { ThreadCard, ThreadCardSkeleton } from "@/components/thread-card"
import { CreateThreadDialog } from "@/components/create-thread-dialog"
import { useVoteThreadList } from "@/hooks/use-vote-thread-list"
import { createFileRoute } from "@tanstack/react-router"
import z from "zod"
import { useThread } from "@/hooks/use-thread"
import { useUsers } from "@/hooks/use-users"
import { NavBar } from "@/components/nav-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { LayoutList } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector } from "../hooks/use-store"

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    search: z.string().optional(),
    categories: z.array(z.string()).optional(),
  }),
  component: HomeComponent,
})

function HomeComponent() {
  const { search, categories } = Route.useSearch()
  const auth = useAppSelector((state) => state.auth)
  const { data: threads, isLoading: isThreadsLoading } = useThread(
    search,
    categories
  )
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const { mutate: voteThread } = useVoteThreadList()

  const isLoading = isThreadsLoading || isUsersLoading
  const isEmpty = !isLoading && threads?.length === 0

  return (
    <div className="grid h-svh grid-rows-[auto_1fr_auto]">
      <NavBar />
      <ScrollArea className="min-h-0">
        <div className="mx-auto max-w-2xl space-y-4 p-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ThreadCardSkeleton key={i} />
              ))
            : threads?.map((thread) => {
                const owner = users?.find((u) => u.id === thread.ownerId)
                return (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    enableVote={!!auth}
                    currentUserId={auth?.id}
                    ownerName={owner?.name}
                    ownerAvatar={owner?.avatar}
                    onUpVote={(id) =>
                      voteThread({ threadId: id, voteType: "up" })
                    }
                    onDownVote={(id) =>
                      voteThread({ threadId: id, voteType: "down" })
                    }
                    onNeutralVote={(id) =>
                      voteThread({ threadId: id, voteType: "neutral" })
                    }
                  />
                )
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
                    : "Belum ada thread yang dibuat."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </ScrollArea>
      {auth && <CreateThreadDialog />}
      <BottomNavBar />
    </div>
  )
}
