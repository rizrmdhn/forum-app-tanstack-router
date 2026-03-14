import { describe, it, expect } from 'vitest';
import { makeUser } from '@/test/factories';
import authReducer from './reducer';
import {
  receiveAuthUserActionCreator,
  unsetAuthUserActionCreator,
} from './action';

describe('authReducer', () => {
  /**
   * Skenario: reducer dipanggil tanpa state dan action tidak dikenal.
   * Harapan: initial state null dikembalikan.
   */
  it('should return null as the initial state when given an unknown action', () => {
    const state = authReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toBeNull();
  });

  /**
   * Skenario: RECEIVE_AUTH_USER dikirim dengan data user.
   * Harapan: state berubah menjadi user yang diterima.
   */
  it('should store the user when RECEIVE_AUTH_USER is dispatched', () => {
    const user = makeUser();

    const state = authReducer(null, receiveAuthUserActionCreator(user));

    expect(state).toEqual(user);
  });

  /**
   * Skenario: RECEIVE_AUTH_USER dikirim saat sudah ada user (re-login / refresh).
   * Harapan: state diganti dengan user baru.
   */
  it('should replace the current user when RECEIVE_AUTH_USER is dispatched again', () => {
    const oldUser = makeUser();
    const newUser = makeUser();

    const state = authReducer(oldUser, receiveAuthUserActionCreator(newUser));

    expect(state).toEqual(newUser);
    expect(state).not.toEqual(oldUser);
  });

  /**
   * Skenario: UNSET_AUTH_USER dikirim setelah user login.
   * Harapan: state dikembalikan ke null (user logged out).
   */
  it('should return null when UNSET_AUTH_USER is dispatched', () => {
    const user = makeUser();

    const state = authReducer(user, unsetAuthUserActionCreator());

    expect(state).toBeNull();
  });
});
