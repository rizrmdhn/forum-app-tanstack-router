import { describe, it, expect } from 'vitest';
import isPreloadReducer from './reducer';
import { setIsPreloadActionCreator } from './action';

describe('isPreloadReducer', () => {
  /**
   * Skenario: reducer dipanggil tanpa state dan action tidak dikenal.
   * Harapan: initial state true dikembalikan (aplikasi sedang preloading).
   */
  it('should return true as the initial state when given an unknown action', () => {
    const state = isPreloadReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toBe(true);
  });

  /**
   * Skenario: SET_IS_PRELOAD dikirim dengan nilai false setelah preload selesai.
   * Harapan: state berubah menjadi false.
   */
  it('should set state to false when SET_IS_PRELOAD false is dispatched', () => {
    const state = isPreloadReducer(true, setIsPreloadActionCreator(false));

    expect(state).toBe(false);
  });

  /**
   * Skenario: SET_IS_PRELOAD dikirim dengan null ketika preload gagal (error).
   * Harapan: state berubah menjadi null.
   */
  it('should set state to null when SET_IS_PRELOAD null is dispatched', () => {
    const state = isPreloadReducer(true, setIsPreloadActionCreator(null));

    expect(state).toBeNull();
  });
});
