import type { SearchResult } from './tmdb';

export type JikanMediaType = 'ANIME' | 'MANGA';

export type JikanResult = {
  mal_id: number;
  title?: string;
  year?: number | null;
  published?: { from?: string | null };
  images?: { jpg?: { image_url?: string; large_image_url?: string } };
  synopsis?: string | null;
  studios?: { name?: string }[];
  authors?: { name?: string }[];
};

export const normalizeJikanResult = (mediaType: JikanMediaType, result: JikanResult): SearchResult => {
  const releaseYear =
    mediaType === 'ANIME'
      ? (result.year ?? null)
      : result.published?.from
        ? Number(result.published.from.slice(0, 4))
        : null;

  const creators = (mediaType === 'ANIME' ? result.studios : result.authors) ?? [];

  return {
    mediaType,
    externalSource: 'JIKAN',
    externalId: String(result.mal_id),
    title: result.title ?? 'Untitled',
    releaseYear: releaseYear != null && Number.isFinite(releaseYear) ? releaseYear : null,
    coverImageUrl: result.images?.jpg?.image_url ?? null,
    creators: creators.map((c) => c.name).filter((name): name is string => !!name),
    description: result.synopsis ?? null,
  };
};

export const searchJikan = async (mediaType: JikanMediaType, query: string): Promise<SearchResult[]> => {
  const endpoint = mediaType === 'ANIME' ? 'anime' : 'manga';
  const url = new URL(`https://api.jikan.moe/v4/${endpoint}`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '20');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Jikan search failed with status ${response.status}`);
  }

  const body = (await response.json()) as { data?: JikanResult[] };
  return (body.data ?? []).map((result) => normalizeJikanResult(mediaType, result));
};
