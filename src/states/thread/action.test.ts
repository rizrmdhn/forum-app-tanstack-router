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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: API berhasil mengembalikan daftar thread.
   * Harapan: dispatch dipanggil dengan loading lalu success beserta data thread.
   */
  it('should dispatch loading then success with thread list when API resolves', async () => {
    const threads = [makeThread(), makeThread()];
    vi.mocked(api.getAllThreads).mockResolvedValue(threads);

    const thunk = asyncLoadThreads();
    await thunk(dispatch as never);

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
    await thunk(dispatch as never);

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
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenLastCalledWith(
      setThreadsActionCreator({ status: 'success', data: [], error: null })
    );
  });
});
