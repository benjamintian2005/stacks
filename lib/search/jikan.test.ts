import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { normalizeJikanResult, searchJikan } from './jikan';

describe('normalizeJikanResult', () => {
  it('normalizes an anime result using year and studios', () => {
    const result = normalizeJikanResult('ANIME', {
      mal_id: 1,
      title: 'Cowboy Bebop',
      year: 1998,
      images: { jpg: { image_url: 'https://cdn.myanimelist.net/cowboy.jpg' } },
      synopsis: 'Spike and Jet...',
      studios: [{ name: 'Sunrise' }],
    });

    expect(result).toEqual({
      mediaType: 'ANIME',
      externalSource: 'JIKAN',
      externalId: '1',
      title: 'Cowboy Bebop',
      releaseYear: 1998,
      coverImageUrl: 'https://cdn.myanimelist.net/cowboy.jpg',
      creators: ['Sunrise'],
      description: 'Spike and Jet...',
    });
  });

  it('normalizes a manga result using published.from and authors', () => {
    const result = normalizeJikanResult('MANGA', {
      mal_id: 2,
      title: 'Berserk',
      published: { from: '1989-08-25T00:00:00+00:00' },
      authors: [{ name: 'Kentaro Miura' }],
    });

    expect(result.releaseYear).toBe(1989);
    expect(result.creators).toEqual(['Kentaro Miura']);
  });

  it('falls back gracefully when fields are missing', () => {
    const result = normalizeJikanResult('ANIME', { mal_id: 3 });
    expect(result.title).toBe('Untitled');
    expect(result.releaseYear).toBeNull();
    expect(result.coverImageUrl).toBeNull();
  });
});

describe('searchJikan', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hits the anime endpoint for ANIME', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ data: [] }) } as Response);
    await searchJikan('ANIME', 'bebop');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/v4/anime?'));
  });

  it('hits the manga endpoint for MANGA', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ data: [] }) } as Response);
    await searchJikan('MANGA', 'berserk');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/v4/manga?'));
  });
});
