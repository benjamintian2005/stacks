import type { MediaType, LibraryStatus } from './generated/prisma';

export type { MediaType, LibraryStatus };

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
) as Record<string, MediaType>;

export const mediaTypeFromSlug = (slug: string): MediaType | undefined => SLUG_TO_MEDIA_TYPE[slug];

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  MOVIE: 'Movies',
  TV: 'TV',
  BOOK: 'Books',
  ALBUM: 'Music',
  ANIME: 'Anime',
  MANGA: 'Manga',
  GAME: 'Games',
};

export const ALL_MEDIA_TYPES: MediaType[] = ['MOVIE', 'TV', 'BOOK', 'ALBUM', 'ANIME', 'MANGA', 'GAME'];

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
};

export const LIBRARY_STATUSES: LibraryStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'];
