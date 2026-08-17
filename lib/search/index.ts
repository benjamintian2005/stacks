import { unstable_cache } from 'next/cache';
import { searchTmdb, type SearchResult } from './tmdb';
import { searchGoogleBooks } from './googleBooks';
import { searchMusicBrainz } from './musicBrainz';
import { searchJikan } from './jikan';
import { searchRawg } from './rawg';
import type { MediaType } from '../types';

export type { SearchResult };

// Catalog metadata barely changes minute-to-minute, so cache identical (mediaType, query) lookups
// to cut down on repeat calls to TMDB/Google Books/MusicBrainz/Jikan/RAWG for popular searches.
const searchMediaUncached = async (mediaType: MediaType, query: string): Promise<SearchResult[]> => {
  switch (mediaType) {
    case 'MOVIE':
    case 'TV':
      return searchTmdb(process.env.TMDB_API_KEY ?? '', mediaType, query);
    case 'BOOK':
      return searchGoogleBooks(process.env.GOOGLE_BOOKS_API_KEY, query);
    case 'ALBUM':
      return searchMusicBrainz(query);
    case 'ANIME':
    case 'MANGA':
      return searchJikan(mediaType, query);
    case 'GAME':
      return searchRawg(process.env.RAWG_API_KEY ?? '', query);
    default:
      return [];
  }
};

const cachedSearchMedia = unstable_cache(searchMediaUncached, ['search-media'], { revalidate: 300 });

export async function searchMedia(mediaType: MediaType, query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  return cachedSearchMedia(mediaType, trimmed.toLowerCase());
}
