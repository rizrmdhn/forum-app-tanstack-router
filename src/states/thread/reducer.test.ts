import { describe, it, expect } from 'vitest';
import { makeThread } from '@/test/factories';
import threadReducer from './reducer';
import {
  setThreadsActionCreator,
  addThreadActionCreator,
  updateThreadActionCreator,
  replaceThreadActionCreator,
} from './action';

// ---------------------------------------------------------------------------
// threadReducer
// ---------------------------------------------------------------------------

describe('threadReducer', () => {
  /**
   * Skenario: reducer dipanggil tanpa state dan dengan action yang tidak dikenal.
   * Harapan: state awal (loading) dikembalikan tanpa perubahan.
   */
  it('should return the initial loading state when given an unknown action', () => {
    const state = threadReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({ status: 'loading', data: null, error: null });
  });

  /**
   * Skenario: SET_THREADS dikirim dengan payload status loading.
   * Harapan: state berubah menjadi loading (data null).
   */
  it('should transition to loading state when SET_THREADS loading is dispatched', () => {
    const existing = {
      status: 'success' as const,
      data: [makeThread()],
      error: null,
    };

    const state = threadReducer(
      existing,
      setThreadsActionCreator({ status: 'loading', data: null, error: null })
    );

    expect(state).toEqual({ status: 'loading', data: null, error: null });
  });

  /**
   * Skenario: SET_THREADS dikirim dengan payload success berisi daftar thread.
   * Harapan: state berubah menjadi success dengan data yang diterima.
   */
  it('should store the thread list when SET_THREADS success is dispatched', () => {
    const threads = [makeThread(), makeThread()];

    const state = threadReducer(
      { status: 'loading', data: null, error: null },
      setThreadsActionCreator({ status: 'success', data: threads, error: null })
    );

    expect(state.status).toBe('success');
    expect(state.data).toEqual(threads);
  });

  /**
   * Skenario: SET_THREADS dikirim dengan payload error.
   * Harapan: state berubah menjadi error dengan pesan yang sesuai.
   */
  it('should store the error message when SET_THREADS error is dispatched', () => {
    const state = threadReducer(
      { status: 'loading', data: null, error: null },
      setThreadsActionCreator({
        status: 'error',
        data: null,
        error: 'Network error',
      })
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Network error');
  });

  /**
   * Skenario: ADD_THREAD dikirim ketika state sudah success.
   * Harapan: thread baru ditambahkan di awal daftar.
   */
  it('should prepend the new thread when ADD_THREAD is dispatched on a success state', () => {
    const existing = makeThread();
    const newThread = makeThread();
    const successState = {
      status: 'success' as const,
      data: [existing],
      error: null,
    };

    const state = threadReducer(
      successState,
      addThreadActionCreator(newThread)
    );

    expect(state.data?.[0]).toEqual(newThread);
    expect(state.data).toHaveLength(2);
  });

  /**
   * Skenario: ADD_THREAD dikirim ketika state masih loading.
   * Harapan: state tidak berubah karena data belum tersedia.
   */
  it('should ignore ADD_THREAD when state is not success', () => {
    const loadingState = {
      status: 'loading' as const,
      data: null,
      error: null,
    };

    const state = threadReducer(
      loadingState,
      addThreadActionCreator(makeThread())
    );

    expect(state).toEqual(loadingState);
  });

  /**
   * Skenario: UPDATE_THREAD dikirim dengan sebagian field yang diubah.
   * Harapan: thread dengan id yang cocok diperbarui secara parsial, thread lain tetap.
   */
  it('should merge updated fields into the matching thread when UPDATE_THREAD is dispatched', () => {
    const thread = makeThread({ upVotesBy: [] });
    const successState = {
      status: 'success' as const,
      data: [thread],
      error: null,
    };

    const state = threadReducer(
      successState,
      updateThreadActionCreator({ id: thread.id, upVotesBy: ['user-x'] })
    );

    expect(state.data?.[0].upVotesBy).toEqual(['user-x']);
    expect(state.data?.[0].title).toBe(thread.title);
  });

  /**
   * Skenario: REPLACE_THREAD dikirim dengan id optimistik dan thread asli dari server.
   * Harapan: thread optimistik diganti sepenuhnya dengan thread asli.
   */
  it('should replace the optimistic thread with the real one when REPLACE_THREAD is dispatched', () => {
    const optimisticThread = makeThread({ id: 'optimistic-999' });
    const realThread = makeThread({ id: 'thread-real' });
    const optimisticState = {
      status: 'success' as const,
      data: [optimisticThread],
      error: null,
    };

    const state = threadReducer(
      optimisticState,
      replaceThreadActionCreator('optimistic-999', realThread)
    );

    expect(state.data?.[0].id).toBe('thread-real');
    expect(state.data).toHaveLength(1);
  });
});
