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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: API berhasil mengembalikan daftar user.
   * Harapan: dispatch dipanggil dengan loading lalu success beserta data user.
   */
  it('should dispatch loading then success with user list when API resolves', async () => {
    const users = [makeUser(), makeUser()];
    vi.mocked(api.getAllUsers).mockResolvedValue(users);

    const thunk = asyncLoadUsers();
    await thunk(dispatch as never);

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
    await thunk(dispatch as never);

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
});
