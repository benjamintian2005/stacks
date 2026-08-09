import type { Schema } from '../../amplify/data/resource';

export type MediaType = Schema['MediaType']['type'];
export type LibraryStatus = Schema['LibraryStatus']['type'];
export type MediaSearchResult = Schema['MediaSearchResult']['type'];
export type MediaItem = Schema['MediaItem']['type'];
export type LibraryEntry = Schema['LibraryEntry']['type'];
export type DiaryEntry = Schema['DiaryEntry']['type'];

/** URL-friendly slug for each media type, used in routes like /discover/:mediaTypeSlug */
export const MEDIA_TYPE_SLUGS = {
  MOVIE: 'movies',
  TV: 'tv',
  BOOK: 'books',
  ALBUM: 'music',
  ANIME: 'anime',
  MANGA: 'manga',
  GAME: 'games',
} as const satisfies Record<MediaType, string>;

export type MediaTypeSlug = (typeof MEDIA_TYPE_SLUGS)[MediaType];

const SLUG_TO_MEDIA_TYPE = Object.fromEntries(
  Object.entries(MEDIA_TYPE_SLUGS).map(([mediaType, slug]) => [slug, mediaType])
) as Record<MediaTypeSlug, MediaType>;

export const mediaTypeFromSlug = (slug: string): MediaType | undefined =>
  SLUG_TO_MEDIA_TYPE[slug as MediaTypeSlug];

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  MOVIE: 'Movies',
  TV: 'TV',
  BOOK: 'Books',
  ALBUM: 'Music',
  ANIME: 'Anime',
  MANGA: 'Manga',
  GAME: 'Games',
};

/** Media types with a working searchMedia backend. */
export const IMPLEMENTED_MEDIA_TYPES: MediaType[] = ['MOVIE', 'TV', 'BOOK', 'ALBUM', 'ANIME', 'MANGA', 'GAME'];

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
};
