import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { extractRymUsername, parseRateYourMusicPage, parseRateYourMusic } from './rateYourMusic';

const pageHtml = (albums: { album: string; artist: string; rating: string }[]) => `
<div class="collection">
  ${albums
    .map(
      (a) => `
    <div class="row">
      <div class="or_q_albumartist">
        <a class="album">${a.album}</a>
        <a class="artist">${a.artist}</a>
      </div>
      <span class="rating_num">${a.rating}</span>
    </div>
  `
    )
    .join('')}
</div>`;

describe('extractRymUsername', () => {
  it('extracts a username from a /collection/ URL', () => {
    expect(extractRymUsername('https://rateyourmusic.com/collection/someuser/')).toBe('someuser');
  });

  it('extracts a username from a ~username form', () => {
    expect(extractRymUsername('~someuser')).toBe('someuser');
  });
});

describe('parseRateYourMusicPage', () => {
  it('extracts artist, album, and rating', () => {
    const html = pageHtml([{ album: 'OK Computer', artist: 'Radiohead', rating: '4.50' }]);
    const items = parseRateYourMusicPage(html);

    expect(items).toEqual([{ title: 'Radiohead - OK Computer', rating: 4.5, platform: 'RATEYOURMUSIC' }]);
  });

  it('returns an empty array when there are no album blocks', () => {
    expect(parseRateYourMusicPage('<table></table>')).toEqual([]);
  });
});

describe('parseRateYourMusic', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('paginates until an empty page is returned', async () => {
    const page1 = pageHtml([{ album: 'OK Computer', artist: 'Radiohead', rating: '4.50' }]);
    const page2 = pageHtml([{ album: 'Kid A', artist: 'Radiohead', rating: '4.00' }]);
    const page3 = '<table></table>';

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, text: async () => page1 } as Response)
      .mockResolvedValueOnce({ ok: true, text: async () => page2 } as Response)
      .mockResolvedValueOnce({ ok: true, text: async () => page3 } as Response);

    const items = await parseRateYourMusic('someuser');

    expect(items).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('stops on the first non-OK response instead of throwing', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
    const items = await parseRateYourMusic('someuser');
    expect(items).toEqual([]);
  });
});
