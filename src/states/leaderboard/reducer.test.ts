import { describe, it, expect } from 'vitest';
import { makeLeaderboard } from '@/test/factories';
import leaderboardReducer from './reducer';
import { setLeaderboardActionCreator } from './action';

describe('leaderboardReducer', () => {
  /**
   * Skenario: reducer dipanggil tanpa state dan action tidak dikenal.
   * Harapan: initial state loading dikembalikan.
   */
  it('should return the initial loading state when given an unknown action', () => {
    const state = leaderboardReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({ status: 'loading', data: null, error: null });
  });

  /**
   * Skenario: SET_LEADERBOARD dikirim dengan payload success berisi data leaderboard.
   * Harapan: state berubah menjadi success dengan data yang diterima.
   */
  it('should store the leaderboard list when SET_LEADERBOARD success is dispatched', () => {
    const leaderboards = [makeLeaderboard(), makeLeaderboard()];

    const state = leaderboardReducer(
      { status: 'loading', data: null, error: null },
      setLeaderboardActionCreator({
        status: 'success',
        data: leaderboards,
        error: null,
      })
    );

    expect(state.status).toBe('success');
    expect(state.data).toEqual(leaderboards);
  });

  /**
   * Skenario: SET_LEADERBOARD dikirim dengan payload error.
   * Harapan: state berubah menjadi error dengan pesan yang sesuai.
   */
  it('should store the error message when SET_LEADERBOARD error is dispatched', () => {
    const state = leaderboardReducer(
      { status: 'loading', data: null, error: null },
      setLeaderboardActionCreator({
        status: 'error',
        data: null,
        error: 'Failed to fetch',
      })
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Failed to fetch');
  });
});
