import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { extractLetterboxdUsername, parseLetterboxdRss, parseLetterboxd } from './letterboxd';

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:letterboxd="https://letterboxd.com">
  <channel>
    <item>
      <title>Fight Club, 1999</title>
      <letterboxd:filmtitle>Fight Club</letterboxd:filmtitle>
      <letterboxd:memberrating>4.5</letterboxd:memberrating>
    </item>
    <item>
      <title>Perfect Blue, 1997</title>
      <letterboxd:filmtitle>Perfect Blue</letterboxd:filmtitle>
    </item>
  </channel>
</rss>`;

describe('extractLetterboxdUsername', () => {
  it('extracts a username from a full profile URL', () => {
    expect(extractLetterboxdUsername('https://letterboxd.com/someuser/')).toBe('someuser');
  });

  it('passes through a bare username unchanged', () => {
    expect(extractLetterboxdUsername('someuser')).toBe('someuser');
  });
});

describe('parseLetterboxdRss', () => {
  it('parses titles and ratings, defaulting missing ratings to null', () => {
    const items = parseLetterboxdRss(SAMPLE_RSS);

    expect(items).toEqual([
      { title: 'Fight Club', rating: 4.5, platform: 'LETTERBOXD' },
      { title: 'Perfect Blue', rating: null, platform: 'LETTERBOXD' },
    ]);
  });

  it('returns an empty array when there are no items', () => {
    expect(parseLetterboxdRss('<rss><channel></channel></rss>')).toEqual([]);
  });
});

describe('parseLetterboxd', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the canonical RSS URL for the extracted username', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, text: async () => SAMPLE_RSS } as Response);

    const items = await parseLetterboxd('https://letterboxd.com/someuser/');

    expect(fetch).toHaveBeenCalledWith('https://letterboxd.com/someuser/rss/', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(items).toHaveLength(2);
  });

  it('throws when the RSS fetch is not OK', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
    await expect(parseLetterboxd('someuser')).rejects.toThrow('404');
  });
});
