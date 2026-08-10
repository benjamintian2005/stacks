import { searchTmdb, type SearchResult } from './tmdb';
import { searchGoogleBooks } from './googleBooks';
import { searchMusicBrainz } from './musicBrainz';
import { searchJikan } from './jikan';
import { searchRawg } from './rawg';
import type { MediaType } from '../types';

export type { SearchResult };

export async function searchMedia(mediaType: MediaType, query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

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
}
