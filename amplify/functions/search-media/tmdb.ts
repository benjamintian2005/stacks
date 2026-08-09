export type TmdbMediaType = 'MOVIE' | 'TV';

export type SearchResult = {
  mediaType: 'MOVIE' | 'TV' | 'BOOK' | 'ALBUM' | 'ANIME' | 'MANGA' | 'GAME';
  externalSource: 'TMDB' | 'GOOGLEBOOKS' | 'MUSICBRAINZ' | 'JIKAN' | 'RAWG' | 'MANUAL';
  externalId: string;
  title: string;
  releaseYear: number | null;
  coverImageUrl: string | null;
  creators: string[];
  description: string | null;
};

export type TmdbResult = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const normalizeTmdbResult = (mediaType: TmdbMediaType, result: TmdbResult): SearchResult => {
  const dateStr = mediaType === 'MOVIE' ? result.release_date : result.first_air_date;
  const releaseYear = dateStr ? Number(dateStr.slice(0, 4)) : null;

  return {
    mediaType,
    externalSource: 'TMDB',
    externalId: String(result.id),
    title: (mediaType === 'MOVIE' ? result.title : result.name) ?? 'Untitled',
    releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
    coverImageUrl: result.poster_path ? `${TMDB_IMAGE_BASE}${result.poster_path}` : null,
    creators: [],
    description: result.overview ?? null,
  };
};

export const searchTmdb = async (
  apiKey: string,
  mediaType: TmdbMediaType,
  query: string
): Promise<SearchResult[]> => {
  const endpoint = mediaType === 'MOVIE' ? 'movie' : 'tv';
  const url = new URL(`https://api.themoviedb.org/3/search/${endpoint}`);
  url.searchParams.set('query', query);
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('api_key', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB search failed with status ${response.status}`);
  }

  const body = (await response.json()) as { results?: TmdbResult[] };
  return (body.results ?? []).map((result) => normalizeTmdbResult(mediaType, result));
};
