import api from '@/lib/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeThread, makeUser } from '@/test/factories';
import { asyncLoadThreadsAndUsers } from './action';
import { setThreadsActionCreator } from '../thread/action';
import { setUsersActionCreator } from '../user/action';

vi.mock('@/lib/api', () => ({
  default: {
    getAllThreads: vi.fn(),
    getAllUsers: vi.fn(),
  },
}));

describe('asyncLoadThreadsAndUsers', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: kedua API (threads dan users) berhasil.
   * Harapan: dispatch dipanggil loading untuk keduanya, lalu success untuk keduanya.
   */
  it('should dispatch success for both threads and users when both APIs resolve', async () => {
    const threads = [makeThread()];
    const users = [makeUser()];
    vi.mocked(api.getAllThreads).mockResolvedValue(threads);
    vi.mocked(api.getAllUsers).mockResolvedValue(users);

    const thunk = asyncLoadThreadsAndUsers();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenCalledWith(
      setThreadsActionCreator({ status: 'loading', data: null, error: null })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsersActionCreator({ status: 'loading', data: null, error: null })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsActionCreator({ status: 'success', data: threads, error: null })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsersActionCreator({ status: 'success', data: users, error: null })
    );
  });

  /**
   * Skenario: API threads gagal tetapi API users berhasil.
   * Harapan: threads dispatch error, users dispatch success (independen).
   */
  it('should dispatch error for threads and success for users when only threads API rejects', async () => {
    const users = [makeUser()];
    vi.mocked(api.getAllThreads).mockRejectedValue(
      new Error('Threads unavailable')
    );
    vi.mocked(api.getAllUsers).mockResolvedValue(users);

    const thunk = asyncLoadThreadsAndUsers();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenCalledWith(
      setThreadsActionCreator({
        status: 'error',
        data: null,
        error: 'Threads unavailable',
      })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsersActionCreator({ status: 'success', data: users, error: null })
    );
  });

  /**
   * Skenario: kedua API gagal.
   * Harapan: dispatch dipanggil error untuk keduanya dengan pesan masing-masing.
   */
  it('should dispatch error for both when both APIs reject', async () => {
    vi.mocked(api.getAllThreads).mockRejectedValue(new Error('Threads error'));
    vi.mocked(api.getAllUsers).mockRejectedValue(new Error('Users error'));

    const thunk = asyncLoadThreadsAndUsers();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenCalledWith(
      setThreadsActionCreator({
        status: 'error',
        data: null,
        error: 'Threads error',
      })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsersActionCreator({
        status: 'error',
        data: null,
        error: 'Users error',
      })
    );
  });
});
