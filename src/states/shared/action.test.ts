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
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getState.mockReturnValue({
      thread: { status: 'loading', data: null, error: null },
      user: { status: 'loading', data: null, error: null },
    });
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
    await thunk(dispatch, getState);

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
    await thunk(dispatch, getState);

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
    await thunk(dispatch, getState);

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

  /**
   * Skenario: data sudah ada di store dan kedua API gagal.
   * Harapan: data yang sudah ada tetap dipertahankan pada state loading dan error.
   */
  it('should preserve existing data in loading and error state when data already exists', async () => {
    const existingThreads = [makeThread()];
    const existingUsers = [makeUser()];
    getState.mockReturnValue({
      thread: { status: 'success', data: existingThreads, error: null },
      user: { status: 'success', data: existingUsers, error: null },
    });
    vi.mocked(api.getAllThreads).mockRejectedValue(new Error('Threads error'));
    vi.mocked(api.getAllUsers).mockRejectedValue(new Error('Users error'));

    const thunk = asyncLoadThreadsAndUsers();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      setThreadsActionCreator({ status: 'loading', data: existingThreads, error: null })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsersActionCreator({ status: 'loading', data: existingUsers, error: null })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setThreadsActionCreator({
        status: 'error',
        data: existingThreads,
        error: 'Threads error',
      })
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsersActionCreator({
        status: 'error',
        data: existingUsers,
        error: 'Users error',
      })
    );
  });
});
