import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { normalizeRawgGame, searchRawg } from './rawg';

describe('normalizeRawgGame', () => {
  it('normalizes a game result', () => {
    const result = normalizeRawgGame({
      id: 3498,
      name: 'Grand Theft Auto V',
      released: '2013-09-17',
      background_image: 'https://media.rawg.io/gtav.jpg',
    });

    expect(result).toEqual({
      mediaType: 'GAME',
      externalSource: 'RAWG',
      externalId: '3498',
      title: 'Grand Theft Auto V',
      releaseYear: 2013,
      coverImageUrl: 'https://media.rawg.io/gtav.jpg',
      creators: [],
      description: null,
    });
  });

  it('falls back gracefully when fields are missing', () => {
    const result = normalizeRawgGame({ id: 1 });
    expect(result.title).toBe('Untitled');
    expect(result.releaseYear).toBeNull();
    expect(result.coverImageUrl).toBeNull();
  });
});

describe('searchRawg', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes the API key in the request', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ results: [] }) } as Response);
    await searchRawg('test-key', 'zelda');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('key=test-key'));
  });

  it('throws when the response is not OK', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 403 } as Response);
    await expect(searchRawg('bad-key', 'anything')).rejects.toThrow('403');
  });
});
