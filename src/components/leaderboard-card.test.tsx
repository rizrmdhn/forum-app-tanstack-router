import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makeLeaderboard } from '@/test/factories';
import { LeaderboardCard } from './leaderboard-card';

describe('LeaderboardCard', () => {
  /**
   * Skenario: entry leaderboard dengan rank dan skor valid dirender.
   * Harapan: nama user, skor dalam format "N pts", dan nomor rank tampil.
   */
  it('should render user name, score, and rank number', () => {
    const entry = makeLeaderboard({ score: 42 });
    render(<LeaderboardCard entry={entry} rank={4} />);

    expect(screen.getByText(entry.user.name)).toBeInTheDocument();
    expect(screen.getByText('42 pts')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  /**
   * Skenario: entry dirender sebagai rank 1 (juara pertama).
   * Harapan: elemen rank memiliki class warna kuning (text-yellow-500).
   */
  it('should apply yellow color class for rank 1', () => {
    const entry = makeLeaderboard();
    render(<LeaderboardCard entry={entry} rank={1} />);

    const rankEl = screen.getByText('1');
    expect(rankEl.className).toContain('text-yellow-500');
  });

  /**
   * Skenario: entry dirender sebagai rank 2 (juara kedua).
   * Harapan: elemen rank memiliki class warna perak (text-slate-400).
   */
  it('should apply slate color class for rank 2', () => {
    const entry = makeLeaderboard();
    render(<LeaderboardCard entry={entry} rank={2} />);

    const rankEl = screen.getByText('2');
    expect(rankEl.className).toContain('text-slate-400');
  });

  /**
   * Skenario: entry dirender di luar top 3 (rank 4 ke atas).
   * Harapan: elemen rank menggunakan class warna muted-foreground (default).
   */
  it('should apply muted foreground color class for rank outside top 3', () => {
    const entry = makeLeaderboard();
    render(<LeaderboardCard entry={entry} rank={5} />);

    const rankEl = screen.getByText('5');
    expect(rankEl.className).toContain('text-muted-foreground');
  });
});
