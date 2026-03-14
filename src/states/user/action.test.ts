import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/lib/api';
import { makeUser } from '@/test/factories';
import { asyncLoadUsers, setUsersActionCreator } from './action';

vi.mock('@/lib/api', () => ({
  default: {
    getAllUsers: vi.fn(),
  },
}));

describe('asyncLoadUsers', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getState.mockReturnValue({ user: { status: 'loading', data: null, error: null } });
  });

  /**
   * Skenario: API berhasil mengembalikan daftar user.
   * Harapan: dispatch dipanggil dengan loading lalu success beserta data user.
   */
  it('should dispatch loading then success with user list when API resolves', async () => {
    const users = [makeUser(), makeUser()];
    vi.mocked(api.getAllUsers).mockResolvedValue(users);

    const thunk = asyncLoadUsers();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setUsersActionCreator({ status: 'loading', data: null, error: null })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setUsersActionCreator({ status: 'success', data: users, error: null })
    );
  });

  /**
   * Skenario: API gagal saat mengambil daftar user.
   * Harapan: dispatch dipanggil dengan loading lalu error beserta pesan error.
   */
  it('should dispatch loading then error with the error message when API rejects', async () => {
    vi.mocked(api.getAllUsers).mockRejectedValue(new Error('Unauthorized'));

    const thunk = asyncLoadUsers();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setUsersActionCreator({ status: 'loading', data: null, error: null })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setUsersActionCreator({
        status: 'error',
        data: null,
        error: 'Unauthorized',
      })
    );
  });

  /**
   * Skenario: data user sudah ada di store dan API gagal.
   * Harapan: data yang sudah ada tetap dipertahankan pada state loading dan error.
   */
  it('should preserve existing users in loading and error state when data already exists', async () => {
    const existingUsers = [makeUser()];
    getState.mockReturnValue({
      user: { status: 'success', data: existingUsers, error: null },
    });
    vi.mocked(api.getAllUsers).mockRejectedValue(new Error('Service unavailable'));

    const thunk = asyncLoadUsers();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setUsersActionCreator({ status: 'loading', data: existingUsers, error: null })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setUsersActionCreator({
        status: 'error',
        data: existingUsers,
        error: 'Service unavailable',
      })
    );
  });
});
