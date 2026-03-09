import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useThreadDetail } from "@/hooks/use-thread-detail"
import { useAppSelector } from "@/hooks/use-store"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export const Route = createFileRoute("/threads/$threadId")({
  component: ThreadDetailComponent,
})

function ThreadDetailComponent() {
  const { threadId } = Route.useParams()
  const router = useRouter()
  const auth = useAppSelector((state) => state.auth)
  const { data: thread, isLoading } = useThreadDetail(threadId)

  const hasUpVoted = auth?.id
    ? (thread?.upVotesBy ?? []).includes(auth.id)
    : false
  const hasDownVoted = auth?.id
    ? (thread?.downVotesBy ?? []).includes(auth.id)
    : false

  return (
    <div className="grid h-svh grid-rows-[auto_1fr]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b bg-primary p-4 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.history.back()}
        >
          <ChevronLeft />
        </Button>
        <span className="font-semibold">Detail Thread</span>
      </div>

      <ScrollArea className="min-h-0">
        <div className="mx-auto max-w-2xl space-y-6 p-4">
          {isLoading ? (
            <ThreadDetailSkeleton />
          ) : thread ? (
            <>
              {/* Thread body */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage
                        src={thread.owner.avatar}
                        alt={thread.owner.name}
                      />
                      <AvatarFallback>
                        {thread.owner.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {thread.owner.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(thread.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <h1 className="text-xl font-bold">{thread.title}</h1>

                {thread.category && (
                  <Badge variant="secondary">#{thread.category}</Badge>
                )}

                <div
                  className="text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: thread.body }}
                />

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant={hasUpVoted ? "default" : "outline"}
                    size="sm"
                  >
                    <ThumbsUp />
                    {thread.upVotesBy.length}
                  </Button>
                  <Button
                    variant={hasDownVoted ? "destructive" : "outline"}
                    size="sm"
                  >
                    <ThumbsDown />
                    {thread.downVotesBy.length}
                  </Button>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="size-3.5" />
                    {thread.comments.length} komentar
                  </div>
                </div>
              </div>

              <Separator />

              {/* Comments */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">
                  Komentar ({thread.comments.length})
                </h2>
                {thread.comments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Belum ada komentar.
                  </p>
                ) : (
                  thread.comments.map((comment) => {
                    const commentUpVoted = auth?.id
                      ? comment.upVotesBy.includes(auth.id)
                      : false
                    const commentDownVoted = auth?.id
                      ? comment.downVotesBy.includes(auth.id)
                      : false

                    return (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar size="sm">
                              <AvatarImage
                                src={comment.owner.avatar}
                                alt={comment.owner.name}
                              />
                              <AvatarFallback>
                                {comment.owner.name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {comment.owner.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div
                          className="pl-8 text-sm text-foreground"
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        <div className="flex gap-2 pl-8">
                          <Button
                            variant={commentUpVoted ? "default" : "ghost"}
                            size="xs"
                          >
                            <ThumbsUp />
                            {comment.upVotesBy.length}
                          </Button>
                          <Button
                            variant={commentDownVoted ? "destructive" : "ghost"}
                            size="xs"
                          >
                            <ThumbsDown />
                            {comment.downVotesBy.length}
                          </Button>
                        </div>
                        <Separator />
                      </div>
                    )
                  })
                )}
              </div>
            </>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  )
}

function ThreadDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-14 rounded-lg" />
        <Skeleton className="h-7 w-14 rounded-lg" />
      </div>
    </div>
  )
}
