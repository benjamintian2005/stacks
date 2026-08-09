import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { normalizeTmdbResult, searchTmdb } from './tmdb';

describe('normalizeTmdbResult', () => {
  it('normalizes a movie result', () => {
    const result = normalizeTmdbResult('MOVIE', {
      id: 550,
      title: 'Fight Club',
      release_date: '1999-10-15',
      poster_path: '/poster.jpg',
      overview: 'An insomniac office worker...',
    });

    expect(result).toEqual({
      mediaType: 'MOVIE',
      externalSource: 'TMDB',
      externalId: '550',
      title: 'Fight Club',
      releaseYear: 1999,
      coverImageUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
      creators: [],
      description: 'An insomniac office worker...',
    });
  });

  it('normalizes a TV result using name/first_air_date', () => {
    const result = normalizeTmdbResult('TV', {
      id: 1396,
      name: 'Breaking Bad',
      first_air_date: '2008-01-20',
      poster_path: null,
    });

    expect(result.title).toBe('Breaking Bad');
    expect(result.releaseYear).toBe(2008);
    expect(result.coverImageUrl).toBeNull();
  });

  it('falls back gracefully when title/date/poster are missing', () => {
    const result = normalizeTmdbResult('MOVIE', { id: 1 });

    expect(result.title).toBe('Untitled');
    expect(result.releaseYear).toBeNull();
    expect(result.coverImageUrl).toBeNull();
    expect(result.description).toBeNull();
  });
});

describe('searchTmdb', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps a successful response into normalized results', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 550, title: 'Fight Club', release_date: '1999-10-15' }] }),
    } as Response);

    const results = await searchTmdb('test-key', 'MOVIE', 'fight club');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Fight Club');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.themoviedb.org/3/search/movie?')
    );
  });

  it('throws when TMDB responds with a non-OK status', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 401 } as Response);

    await expect(searchTmdb('bad-key', 'MOVIE', 'anything')).rejects.toThrow('401');
  });
});
