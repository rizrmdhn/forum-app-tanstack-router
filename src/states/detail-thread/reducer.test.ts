import { describe, it, expect } from 'vitest';
import { makeDetailThread, makeComment } from '@/test/factories';
import detailThreadReducer from './reducer';
import {
  setDetailThreadActionCreator,
  updateDetailThreadActionCreator,
} from './action';

describe('detailThreadReducer', () => {
  /**
   * Skenario: reducer dipanggil tanpa state dan action tidak dikenal.
   * Harapan: initial state loading dikembalikan.
   */
  it('should return the initial loading state when given an unknown action', () => {
    const state = detailThreadReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({ status: 'loading', data: null, error: null });
  });

  /**
   * Skenario: SET_DETAIL_THREAD dikirim dengan payload loading.
   * Harapan: state berubah menjadi loading.
   */
  it('should transition to loading state when SET_DETAIL_THREAD loading is dispatched', () => {
    const existing = {
      status: 'success' as const,
      data: makeDetailThread(),
      error: null,
    };

    const state = detailThreadReducer(
      existing,
      setDetailThreadActionCreator({
        status: 'loading',
        data: null,
        error: null,
      })
    );

    expect(state).toEqual({ status: 'loading', data: null, error: null });
  });

  /**
   * Skenario: SET_DETAIL_THREAD dikirim dengan payload success berisi detail thread.
   * Harapan: state berubah menjadi success dengan data yang diterima.
   */
  it('should store the detail thread when SET_DETAIL_THREAD success is dispatched', () => {
    const thread = makeDetailThread();

    const state = detailThreadReducer(
      { status: 'loading', data: null, error: null },
      setDetailThreadActionCreator({
        status: 'success',
        data: thread,
        error: null,
      })
    );

    expect(state.status).toBe('success');
    expect(state.data).toEqual(thread);
  });

  /**
   * Skenario: SET_DETAIL_THREAD dikirim dengan payload error.
   * Harapan: state berubah menjadi error dengan pesan yang sesuai.
   */
  it('should store the error message when SET_DETAIL_THREAD error is dispatched', () => {
    const state = detailThreadReducer(
      { status: 'loading', data: null, error: null },
      setDetailThreadActionCreator({
        status: 'error',
        data: null,
        error: 'Not found',
      })
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Not found');
  });

  /**
   * Skenario: UPDATE_DETAIL_THREAD dikirim dengan field yang diubah.
   * Harapan: field yang berubah di-merge ke data yang ada, field lain tidak berubah.
   */
  it('should merge updated fields into the detail thread when UPDATE_DETAIL_THREAD is dispatched', () => {
    const thread = makeDetailThread({ upVotesBy: [] });
    const successState = {
      status: 'success' as const,
      data: thread,
      error: null,
    };

    const state = detailThreadReducer(
      successState,
      updateDetailThreadActionCreator({ upVotesBy: ['user-x'] })
    );

    expect(state.data?.upVotesBy).toEqual(['user-x']);
    expect(state.data?.title).toBe(thread.title);
  });

  /**
   * Skenario: UPDATE_DETAIL_THREAD dikirim untuk memperbarui daftar komentar.
   * Harapan: comments dalam state diganti dengan list baru.
   */
  it('should update the comments list when UPDATE_DETAIL_THREAD is dispatched with new comments', () => {
    const thread = makeDetailThread({ comments: [] });
    const newComment = makeComment();
    const successState = {
      status: 'success' as const,
      data: thread,
      error: null,
    };

    const state = detailThreadReducer(
      successState,
      updateDetailThreadActionCreator({ comments: [newComment] })
    );

    expect(state.data?.comments).toHaveLength(1);
    expect(state.data?.comments[0]).toEqual(newComment);
  });

  /**
   * Skenario: UPDATE_DETAIL_THREAD dikirim ketika state masih loading.
   * Harapan: state tidak berubah karena data belum ada.
   */
  it('should ignore UPDATE_DETAIL_THREAD when state is not success', () => {
    const loadingState = {
      status: 'loading' as const,
      data: null,
      error: null,
    };

    const state = detailThreadReducer(
      loadingState,
      updateDetailThreadActionCreator({ upVotesBy: ['user-x'] })
    );

    expect(state).toEqual(loadingState);
  });
});
