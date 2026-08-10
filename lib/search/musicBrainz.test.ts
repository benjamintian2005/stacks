import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { normalizeMusicBrainzReleaseGroup, searchMusicBrainz } from './musicBrainz';

describe('normalizeMusicBrainzReleaseGroup', () => {
  it('normalizes a release group with artist credits', () => {
    const result = normalizeMusicBrainzReleaseGroup({
      id: 'b1392450-e666-3926-a536-22c65f834433',
      title: 'OK Computer',
      'first-release-date': '1997-05-21',
      'artist-credit': [{ name: 'Radiohead' }],
    });

    expect(result.mediaType).toBe('ALBUM');
    expect(result.externalSource).toBe('MUSICBRAINZ');
    expect(result.title).toBe('OK Computer');
    expect(result.releaseYear).toBe(1997);
    expect(result.creators).toEqual(['Radiohead']);
    expect(result.coverImageUrl).toContain('coverartarchive.org/release-group/b1392450-e666-3926-a536-22c65f834433');
  });

  it('falls back gracefully when fields are missing', () => {
    const result = normalizeMusicBrainzReleaseGroup({ id: 'x' });
    expect(result.title).toBe('Untitled');
    expect(result.releaseYear).toBeNull();
    expect(result.creators).toEqual([]);
  });
});

describe('searchMusicBrainz', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a User-Agent header and maps results', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ 'release-groups': [{ id: '1', title: 'Kid A' }] }),
    } as Response);

    const results = await searchMusicBrainz('kid a');

    expect(results).toHaveLength(1);
    const [, options] = vi.mocked(fetch).mock.calls[0];
    expect((options?.headers as Record<string, string>)['User-Agent']).toContain('Stacks-MediaTracker');
  });
});
