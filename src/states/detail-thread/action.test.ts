import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/lib/api';
import { makeDetailThread } from '@/test/factories';
import { faker } from '@faker-js/faker';
import { asyncLoadDetailThread, setDetailThreadActionCreator } from './action';

vi.mock('@/lib/api', () => ({
  default: {
    getThreadById: vi.fn(),
  },
}));

describe('asyncLoadDetailThread', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Skenario: API berhasil mengembalikan detail thread berdasarkan id.
   * Harapan: dispatch dipanggil dengan loading lalu success beserta data thread.
   */
  it('should dispatch loading then success with thread data when API resolves', async () => {
    const threadId = faker.string.uuid();
    const thread = makeDetailThread({ id: threadId });
    vi.mocked(api.getThreadById).mockResolvedValue(thread);

    const thunk = asyncLoadDetailThread(threadId);
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setDetailThreadActionCreator({
        status: 'loading',
        data: null,
        error: null,
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setDetailThreadActionCreator({
        status: 'success',
        data: thread,
        error: null,
      })
    );
  });

  /**
   * Skenario: API gagal (thread tidak ditemukan / server error).
   * Harapan: dispatch dipanggil dengan loading lalu error beserta pesan error.
   */
  it('should dispatch loading then error with the error message when API rejects', async () => {
    const threadId = faker.string.uuid();
    vi.mocked(api.getThreadById).mockRejectedValue(
      new Error('Thread not found')
    );

    const thunk = asyncLoadDetailThread(threadId);
    await thunk(dispatch as never);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setDetailThreadActionCreator({
        status: 'loading',
        data: null,
        error: null,
      })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setDetailThreadActionCreator({
        status: 'error',
        data: null,
        error: 'Thread not found',
      })
    );
  });
});
