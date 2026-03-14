import { describe, it, expect } from 'vitest';
import { makeUser } from '@/test/factories';
import userReducer from './reducer';
import { setUsersActionCreator } from './action';

describe('userReducer', () => {
  /**
   * Skenario: reducer dipanggil tanpa state dan action tidak dikenal.
   * Harapan: initial state loading dikembalikan.
   */
  it('should return the initial loading state when given an unknown action', () => {
    const state = userReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({ status: 'loading', data: null, error: null });
  });

  /**
   * Skenario: SET_USERS dikirim dengan payload success berisi daftar user.
   * Harapan: state berubah menjadi success dengan data user yang diterima.
   */
  it('should store the user list when SET_USERS success is dispatched', () => {
    const users = [makeUser(), makeUser()];

    const state = userReducer(
      { status: 'loading', data: null, error: null },
      setUsersActionCreator({ status: 'success', data: users, error: null })
    );

    expect(state.status).toBe('success');
    expect(state.data).toEqual(users);
  });

  /**
   * Skenario: SET_USERS dikirim dengan payload error.
   * Harapan: state berubah menjadi error dengan pesan yang sesuai.
   */
  it('should store the error message when SET_USERS error is dispatched', () => {
    const state = userReducer(
      { status: 'loading', data: null, error: null },
      setUsersActionCreator({
        status: 'error',
        data: null,
        error: 'Unauthorized',
      })
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Unauthorized');
  });
});
