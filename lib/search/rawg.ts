import type { SearchResult } from './tmdb';

export type RawgGame = {
  id: number;
  name?: string;
  released?: string | null;
  background_image?: string | null;
};

export const normalizeRawgGame = (game: RawgGame): SearchResult => {
  const releaseYear = game.released ? Number(game.released.slice(0, 4)) : null;

  return {
    mediaType: 'GAME',
    externalSource: 'RAWG',
    externalId: String(game.id),
    title: game.name ?? 'Untitled',
    releaseYear: Number.isFinite(releaseYear) ? releaseYear : null,
    coverImageUrl: game.background_image ?? null,
    creators: [],
    description: null,
  };
};

export const searchRawg = async (apiKey: string, query: string): Promise<SearchResult[]> => {
  const url = new URL('https://api.rawg.io/api/games');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('search', query);
  url.searchParams.set('page_size', '20');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`RAWG search failed with status ${response.status}`);
  }

  const body = (await response.json()) as { results?: RawgGame[] };
  return (body.results ?? []).map(normalizeRawgGame);
};
