import type { SearchResult } from './tmdb';

const USER_AGENT = 'Stacks-MediaTracker/0.1 ( https://github.com/benjamintian2005/AWS-hosted-media-portfolio )';

export type MusicBrainzReleaseGroup = {
  id: string;
  title?: string;
  'first-release-date'?: string;
  'artist-credit'?: { name?: string }[];
};

/** Cover Art Archive URLs are constructed optimistically; a missing image 404s client-side. */
const coverArtUrl = (releaseGroupId: string) => `https://coverartarchive.org/release-group/${releaseGroupId}/front-250`;

export const normalizeMusicBrainzReleaseGroup = (releaseGroup: MusicBrainzReleaseGroup): SearchResult => {
  const releaseYear = releaseGroup['first-release-date']
    ? Number(releaseGroup['first-release-date'].slice(0, 4))
    : null;

  return {
    mediaType: 'ALBUM',
    externalSource: 'MUSICBRAINZ',
    externalId: releaseGroup.id,
    title: releaseGroup.title ?? 'Untitled',
    releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
    coverImageUrl: coverArtUrl(releaseGroup.id),
    creators: (releaseGroup['artist-credit'] ?? []).map((credit) => credit.name).filter((name): name is string => !!name),
    description: null,
  };
};

export const searchMusicBrainz = async (query: string): Promise<SearchResult[]> => {
  const url = new URL('https://musicbrainz.org/ws/2/release-group/');
  url.searchParams.set('query', query);
  url.searchParams.set('fmt', 'json');
  url.searchParams.set('limit', '20');

  const response = await fetch(url.toString(), {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`MusicBrainz search failed with status ${response.status}`);
  }

  const body = (await response.json()) as { 'release-groups'?: MusicBrainzReleaseGroup[] };
  return (body['release-groups'] ?? []).map(normalizeMusicBrainzReleaseGroup);
};
