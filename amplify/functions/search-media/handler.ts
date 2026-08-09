import type { Schema } from '../../data/resource';
import { env } from '$amplify/env/search-media';
import { searchTmdb } from './tmdb';
import { searchGoogleBooks } from './googleBooks';
import { searchMusicBrainz } from './musicBrainz';
import { searchJikan } from './jikan';
import { searchRawg } from './rawg';

export const handler: Schema['searchMedia']['functionHandler'] = async (event) => {
  const { mediaType, query } = event.arguments;

  if (!query.trim()) {
    return [];
  }

  switch (mediaType) {
    case 'MOVIE':
    case 'TV':
      return searchTmdb(env.TMDB_API_KEY, mediaType, query);
    case 'BOOK':
      return searchGoogleBooks(undefined, query);
    case 'ALBUM':
      return searchMusicBrainz(query);
    case 'ANIME':
    case 'MANGA':
      return searchJikan(mediaType, query);
    case 'GAME':
      return searchRawg(env.RAWG_API_KEY, query);
    default:
      return [];
  }
};
