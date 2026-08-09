export type ImportPlatform = 'LETTERBOXD' | 'GOODREADS' | 'RATEYOURMUSIC';

export type ScrapedItem = {
  title: string;
  rating: number | null;
  platform: ImportPlatform;
};
