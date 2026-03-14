import api from '@/lib/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeThread } from '@/test/factories';
import { asyncLoadThreads, setThreadsActionCreator } from './action';

vi.mock('@/lib/api', () => ({
  default: {
    getAllThreads: vi.fn(),
  },
}));

describe('asyncLoadThreads', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getState.mockReturnValue({ thread: { status: 'loading', data: null, error: null } });
  });

  /**
   * Skenario: API berhasil mengembalikan daftar thread.
   * Harapan: dispatch dipanggil dengan loading lalu success beserta data thread.
   */
  it('should dispatch loading then success with thread list when API resolves', async () => {
    const threads = [makeThread(), makeThread()];
    vi.mocked(api.getAllThreads).mockResolvedValue(threads);

    const thunk = asyncLoadThreads();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setThreadsActionCreator({ status: 'loading', data: null, error: null })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setThreadsActionCreator({ status: 'success', data: threads, error: null })
    );
  });

  /**
   * Skenario: API gagal saat mengambil thread.
   * Harapan: dispatch dipanggil dengan loading lalu error beserta pesan error.
   */
  it('should dispatch loading then error with the error message when API rejects', async () => {
    vi.mocked(api.getAllThreads).mockRejectedValue(new Error('Failed to load'));

    const thunk = asyncLoadThreads();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setThreadsActionCreator({ status: 'loading', data: null, error: null })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setThreadsActionCreator({
        status: 'error',
        data: null,
        error: 'Failed to load',
      })
    );
  });

  /**
   * Skenario: API berhasil tetapi mengembalikan list kosong.
   * Harapan: state success disimpan dengan array kosong.
   */
  it('should dispatch success with an empty array when API returns no threads', async () => {
    vi.mocked(api.getAllThreads).mockResolvedValue([]);

    const thunk = asyncLoadThreads();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenLastCalledWith(
      setThreadsActionCreator({ status: 'success', data: [], error: null })
    );
  });

  /**
   * Skenario: data thread sudah ada di store dan API gagal.
   * Harapan: data yang sudah ada tetap dipertahankan pada state loading dan error.
   */
  it('should preserve existing threads in loading and error state when data already exists', async () => {
    const existingThreads = [makeThread()];
    getState.mockReturnValue({
      thread: { status: 'success', data: existingThreads, error: null },
    });
    vi.mocked(api.getAllThreads).mockRejectedValue(new Error('Network error'));

    const thunk = asyncLoadThreads();
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setThreadsActionCreator({ status: 'loading', data: existingThreads, error: null })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setThreadsActionCreator({
        status: 'error',
        data: existingThreads,
        error: 'Network error',
      })
    );
  });
});
