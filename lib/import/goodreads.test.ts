import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { buildGoodreadsUrl, parseGoodreadsHtml, parseGoodreads } from './goodreads';

const SAMPLE_HTML = `
<table>
  <tr class="bookalike review">
    <td class="field title"><a href="/book/1">The Catcher in the Rye</a></td>
    <td class="field rating"><span class="staticStars p100">5 stars</span></td>
  </tr>
  <tr class="bookalike review">
    <td class="field title"><a href="/book/2">Dune</a></td>
    <td class="field rating"><span class="staticStars p0">0 stars</span></td>
  </tr>
  <tr class="bookalike review">
    <td class="field title"></td>
  </tr>
</table>`;

describe('buildGoodreadsUrl', () => {
  it('passes a full URL through unchanged', () => {
    expect(buildGoodreadsUrl('https://www.goodreads.com/review/list/someuser')).toBe(
      'https://www.goodreads.com/review/list/someuser'
    );
  });

  it('builds a shelf URL from a bare username', () => {
    expect(buildGoodreadsUrl('someuser')).toBe('https://www.goodreads.com/review/list/someuser');
  });
});

describe('parseGoodreadsHtml', () => {
  it('extracts title and star rating, skipping rows without a title', () => {
    const items = parseGoodreadsHtml(SAMPLE_HTML);

    expect(items).toEqual([
      { title: 'The Catcher in the Rye', rating: 5, platform: 'GOODREADS' },
      { title: 'Dune', rating: 0, platform: 'GOODREADS' },
    ]);
  });
});

describe('parseGoodreads', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws when the fetch is not OK', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 403 } as Response);
    await expect(parseGoodreads('someuser')).rejects.toThrow('403');
  });
});
