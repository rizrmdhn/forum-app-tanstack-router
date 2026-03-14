import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/lib/api';
import { receiveAuthUserActionCreator } from '@/states/auth/action';
import { makeUser } from '@/test/factories';
import { asyncSetIsPreload, setIsPreloadActionCreator } from './action';

vi.mock('@/lib/api', () => ({
  default: {
    getOwnProfile: vi.fn(),
  },
}));

describe('asyncSetIsPreload', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: token valid — API berhasil mengembalikan profil user.
   * Harapan: dispatch dipanggil dengan receiveAuthUser lalu isPreload false.
   */
  it('should dispatch receiveAuthUser then set isPreload to false when token is valid', async () => {
    const user = makeUser();
    vi.mocked(api.getOwnProfile).mockResolvedValue(user);

    const thunk = asyncSetIsPreload();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenCalledWith(receiveAuthUserActionCreator(user));
    expect(dispatch).toHaveBeenLastCalledWith(setIsPreloadActionCreator(false));
  });

  /**
   * Skenario: token tidak ada atau kadaluarsa — API menolak request.
   * Harapan: dispatch dipanggil dengan isPreload null (error) lalu false (finally).
   */
  it('should dispatch isPreload null then false when API rejects (unauthenticated)', async () => {
    vi.mocked(api.getOwnProfile).mockRejectedValue(new Error('Unauthorized'));

    const thunk = asyncSetIsPreload();
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenCalledWith(setIsPreloadActionCreator(null));
    expect(dispatch).toHaveBeenLastCalledWith(setIsPreloadActionCreator(false));
  });
});
