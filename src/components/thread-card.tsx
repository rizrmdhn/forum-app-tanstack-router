import type { IThread } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Skeleton } from './ui/skeleton';

interface ThreadCardProps {
  thread: IThread;
  enableVote?: boolean;
  ownerName?: string;
  ownerAvatar?: string;
  onUpVote?: (threadId: string) => void;
  onDownVote?: (threadId: string) => void;
  onNeutralVote?: (threadId: string) => void;
  currentUserId?: string;
}

export function ThreadCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-1.5">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-7 w-14 rounded-lg" />
        <Skeleton className="h-7 w-14 rounded-lg" />
        <Skeleton className="ml-auto h-3 w-10 rounded" />
      </CardFooter>
    </Card>
  );
}

export function ThreadCard({
  thread,
  enableVote = true,
  ownerName,
  ownerAvatar,
  onUpVote,
  onDownVote,
  onNeutralVote,
  currentUserId,
}: ThreadCardProps) {
  const hasUpVoted = currentUserId
    ? thread.upVotesBy.includes(currentUserId)
    : false;
  const hasDownVoted = currentUserId
    ? thread.downVotesBy.includes(currentUserId)
    : false;

  function handleUpVote() {
    if (!enableVote) return;
    if (hasUpVoted) {
      onNeutralVote?.(thread.id);
    } else {
      onUpVote?.(thread.id);
    }
  }

  function handleDownVote() {
    if (!enableVote) return;
    if (hasDownVoted) {
      onNeutralVote?.(thread.id);
    } else {
      onDownVote?.(thread.id);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={ownerAvatar} alt={ownerName} />
              <AvatarFallback>{ownerName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">
              {ownerName ?? thread.ownerId}
            </span>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(thread.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <CardTitle>
          <Link
            to="/threads/$threadId"
            params={{ threadId: thread.id }}
            className="hover:underline"
          >
            {thread.title}
          </Link>
        </CardTitle>
        {thread.category && (
          <Badge variant="secondary">#{thread.category}</Badge>
        )}
      </CardHeader>

      <CardContent>
        <p
          className="line-clamp-3 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant={hasUpVoted ? 'default' : 'outline'}
          size="sm"
          disabled={!enableVote}
          onClick={() => handleUpVote()}
        >
          <ThumbsUp />
          {thread.upVotesBy.length}
        </Button>
        <Button
          variant={hasDownVoted ? 'destructive' : 'outline'}
          size="sm"
          disabled={!enableVote}
          onClick={() => handleDownVote()}
        >
          <ThumbsDown />
          {thread.downVotesBy.length}
        </Button>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageSquare className="size-3.5" />
          {thread.totalComments}
        </div>
      </CardFooter>
    </Card>
  );
}
