import type { SearchResult } from './tmdb';

export type GoogleBooksVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
};

const toSecureUrl = (url: string) => url.replace(/^http:\/\//, 'https://');

export const normalizeGoogleBooksVolume = (volume: GoogleBooksVolume): SearchResult => {
  const info = volume.volumeInfo ?? {};
  const publishedYear = info.publishedDate ? Number(info.publishedDate.slice(0, 4)) : null;
  const cover = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return {
    mediaType: 'BOOK',
    externalSource: 'GOOGLEBOOKS',
    externalId: volume.id,
    title: info.title ?? 'Untitled',
    releaseYear: Number.isFinite(publishedYear) ? publishedYear : null,
    coverImageUrl: cover ? toSecureUrl(cover) : null,
    creators: info.authors ?? [],
    description: info.description ?? null,
  };
};

export const searchGoogleBooks = async (apiKey: string | undefined, query: string): Promise<SearchResult[]> => {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', '20');
  if (apiKey) {
    url.searchParams.set('key', apiKey);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Google Books search failed with status ${response.status}`);
  }

  const body = (await response.json()) as { items?: GoogleBooksVolume[] };
  return (body.items ?? []).map(normalizeGoogleBooksVolume);
};
