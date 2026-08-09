import { defineFunction, secret } from '@aws-amplify/backend';

export const searchMedia = defineFunction({
  name: 'search-media',
  entry: './handler.ts',
  timeoutSeconds: 15,
  environment: {
    TMDB_API_KEY: secret('TMDB_API_KEY'),
    RAWG_API_KEY: secret('RAWG_API_KEY'),
    // Google Books, MusicBrainz, and Jikan work keyless; no secrets required for those.
  },
});
