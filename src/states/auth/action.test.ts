import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/lib/api';
import { makeUser } from '@/test/factories';
import { faker } from '@faker-js/faker';
import {
  asyncLogin,
  asyncLogout,
  receiveAuthUserActionCreator,
  unsetAuthUserActionCreator,
} from './action';

vi.mock('@/lib/api', () => ({
  default: {
    login: vi.fn(),
    getOwnProfile: vi.fn(),
    putAccessToken: vi.fn(),
  },
}));

describe('asyncLogin', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: kredensial valid — login berhasil dan profil user diterima.
   * Harapan: dispatch dipanggil dengan receiveAuthUser berisi data user.
   */
  it('should dispatch receiveAuthUser with user data when login succeeds', async () => {
    const user = makeUser();
    vi.mocked(api.login).mockResolvedValue();
    vi.mocked(api.getOwnProfile).mockResolvedValue(user);

    const thunk = asyncLogin({
      email: user.email,
      password: faker.internet.password(),
    });
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenCalledWith(receiveAuthUserActionCreator(user));
  });

  /**
   * Skenario: kredensial salah — API login menolak request.
   * Harapan: error dilempar dan dispatch tidak dipanggil.
   */
  it('should throw and not dispatch when login credentials are invalid', async () => {
    vi.mocked(api.login).mockRejectedValue(new Error('Wrong password'));

    const thunk = asyncLogin({ email: 'user@example.com', password: 'wrong' });

    await expect(thunk(dispatch as never)).rejects.toThrow('Wrong password');
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('asyncLogout', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: user menekan tombol logout.
   * Harapan: token dihapus dan dispatch dipanggil dengan unsetAuthUser.
   */
  it('should clear the token and dispatch unsetAuthUser', () => {
    const thunk = asyncLogout();
    thunk(dispatch as never);

    expect(api.putAccessToken).toHaveBeenCalledWith('');
    expect(dispatch).toHaveBeenCalledWith(unsetAuthUserActionCreator());
  });

  /**
   * Skenario: logout dipanggil berulang kali.
   * Harapan: setiap pemanggilan tetap menghapus token dan dispatch unsetAuthUser.
   */
  it('should always clear the token and dispatch unsetAuthUser on each call', () => {
    const thunk = asyncLogout();
    thunk(dispatch as never);
    thunk(dispatch as never);

    expect(api.putAccessToken).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(unsetAuthUserActionCreator());
  });
});
