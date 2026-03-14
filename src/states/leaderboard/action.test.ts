import api from '@/lib/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeLeaderboard } from '@/test/factories';
import { asyncLoadLeaderboard, setLeaderboardActionCreator } from './action';

// ---------------------------------------------------------------------------
// Mock API
// ---------------------------------------------------------------------------

vi.mock('@/lib/api', () => ({
  default: {
    getLeaderboards: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// asyncLoadLeaderboard
// ---------------------------------------------------------------------------

describe('asyncLoadLeaderboard', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: API berhasil mengembalikan data leaderboard.
   * Harapan: dispatch dipanggil pertama dengan loading, lalu dengan success dan data.
   */
  it('should dispatch loading then success with leaderboard data when API resolves', async () => {
    const leaderboards = [makeLeaderboard(), makeLeaderboard()];
    vi.mocked(api.getLeaderboards).mockResolvedValue(leaderboards);

    const thunk = asyncLoadLeaderboard();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setLeaderboardActionCreator({
        status: 'loading',
        data: null,
        error: null,
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setLeaderboardActionCreator({
        status: 'success',
        data: leaderboards,
        error: null,
      })
    );
  });

  /**
   * Skenario: API gagal (network error / server error).
   * Harapan: dispatch dipanggil pertama dengan loading, lalu dengan error dan pesan error.
   */
  it('should dispatch loading then error with the error message when API rejects', async () => {
    vi.mocked(api.getLeaderboards).mockRejectedValue(new Error('Server error'));

    const thunk = asyncLoadLeaderboard();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setLeaderboardActionCreator({
        status: 'loading',
        data: null,
        error: null,
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setLeaderboardActionCreator({
        status: 'error',
        data: null,
        error: 'Server error',
      })
    );
  });

  /**
   * Skenario: API berhasil tetapi mengembalikan list kosong.
   * Harapan: state success disimpan dengan array kosong.
   */
  it('should dispatch success with an empty array when API returns no entries', async () => {
    vi.mocked(api.getLeaderboards).mockResolvedValue([]);

    const thunk = asyncLoadLeaderboard();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenLastCalledWith(
      setLeaderboardActionCreator({ status: 'success', data: [], error: null })
    );
  });
});
