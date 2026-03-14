import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeThread } from '@/test/factories';
import { ThreadCard } from './thread-card';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('./safe-html', () => ({
  SafeHTML: ({ html, className }: { html: string; className?: string }) => (
    <div className={className}>{html}</div>
  ),
}));

describe('ThreadCard', () => {
  /**
   * Skenario: thread dirender dengan data yang valid.
   * Harapan: title, kategori, dan jumlah komentar tampil di layar.
   */
  it('should render thread title, category, and comment count', () => {
    const thread = makeThread({ category: 'react', totalComments: 5 });
    render(<ThreadCard thread={thread} />);

    expect(screen.getByText(thread.title)).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /**
   * Skenario: user belum memberikan upvote, menekan tombol upvote.
   * Harapan: onUpVote dipanggil dengan threadId yang benar.
   */
  it('should call onUpVote with the thread id when up-vote button is clicked', async () => {
    const user = userEvent.setup();
    const thread = makeThread({ upVotesBy: [] });
    const onUpVote = vi.fn();

    render(
      <ThreadCard
        thread={thread}
        currentUserId="user-1"
        onUpVote={onUpVote}
      />
    );

    await user.click(screen.getAllByRole('button')[0]);
    expect(onUpVote).toHaveBeenCalledWith(thread.id);
  });

  /**
   * Skenario: user sudah memberikan upvote, menekan tombol upvote lagi.
   * Harapan: onNeutralVote dipanggil untuk membatalkan vote (toggle off).
   */
  it('should call onNeutralVote when up-vote is clicked again by the same user', async () => {
    const user = userEvent.setup();
    const currentUserId = 'user-1';
    const thread = makeThread({ upVotesBy: [currentUserId] });
    const onNeutralVote = vi.fn();

    render(
      <ThreadCard
        thread={thread}
        currentUserId={currentUserId}
        onNeutralVote={onNeutralVote}
      />
    );

    await user.click(screen.getAllByRole('button')[0]);
    expect(onNeutralVote).toHaveBeenCalledWith(thread.id);
  });

  /**
   * Skenario: user belum memberikan downvote, menekan tombol downvote.
   * Harapan: onDownVote dipanggil dengan threadId yang benar.
   */
  it('should call onDownVote with the thread id when down-vote button is clicked', async () => {
    const user = userEvent.setup();
    const thread = makeThread({ downVotesBy: [] });
    const onDownVote = vi.fn();

    render(
      <ThreadCard
        thread={thread}
        currentUserId="user-1"
        onDownVote={onDownVote}
      />
    );

    await user.click(screen.getAllByRole('button')[1]);
    expect(onDownVote).toHaveBeenCalledWith(thread.id);
  });

  /**
   * Skenario: enableVote=false, tombol vote tidak dapat ditekan.
   * Harapan: semua tombol vote dalam keadaan disabled.
   */
  it('should disable all vote buttons when enableVote is false', () => {
    const thread = makeThread();
    render(<ThreadCard thread={thread} enableVote={false} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});
