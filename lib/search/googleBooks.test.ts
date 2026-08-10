import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { normalizeGoogleBooksVolume, searchGoogleBooks } from './googleBooks';

describe('normalizeGoogleBooksVolume', () => {
  it('normalizes a volume with full metadata', () => {
    const result = normalizeGoogleBooksVolume({
      id: 'zyTCAlFPjgYC',
      volumeInfo: {
        title: 'The Catcher in the Rye',
        authors: ['J.D. Salinger'],
        publishedDate: '1991-05-01',
        description: 'A story about teenage angst.',
        imageLinks: { thumbnail: 'http://books.google.com/books/thumb.jpg' },
      },
    });

    expect(result).toEqual({
      mediaType: 'BOOK',
      externalSource: 'GOOGLEBOOKS',
      externalId: 'zyTCAlFPjgYC',
      title: 'The Catcher in the Rye',
      releaseYear: 1991,
      coverImageUrl: 'https://books.google.com/books/thumb.jpg',
      creators: ['J.D. Salinger'],
      description: 'A story about teenage angst.',
    });
  });

  it('falls back gracefully when volumeInfo fields are missing', () => {
    const result = normalizeGoogleBooksVolume({ id: 'abc' });

    expect(result.title).toBe('Untitled');
    expect(result.releaseYear).toBeNull();
    expect(result.coverImageUrl).toBeNull();
    expect(result.creators).toEqual([]);
  });
});

describe('searchGoogleBooks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('works without an API key', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ id: 'abc', volumeInfo: { title: 'Some Book' } }] }),
    } as Response);

    const results = await searchGoogleBooks(undefined, 'some book');

    expect(results).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith(expect.not.stringContaining('key='));
  });

  it('throws when the response is not OK', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);
    await expect(searchGoogleBooks(undefined, 'anything')).rejects.toThrow('500');
  });
});
