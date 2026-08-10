import { parseLetterboxd } from './letterboxd';
import { parseGoodreads } from './goodreads';
import { parseRateYourMusic } from './rateYourMusic';
import type { ImportPlatform, ScrapedItem } from './types';

export type { ImportPlatform, ScrapedItem };

export async function runImport(platform: ImportPlatform, sourceUrl: string): Promise<ScrapedItem[]> {
  switch (platform) {
    case 'LETTERBOXD':
      return parseLetterboxd(sourceUrl);
    case 'GOODREADS':
      return parseGoodreads(sourceUrl);
    case 'RATEYOURMUSIC':
      return parseRateYourMusic(sourceUrl);
    default:
      return [];
  }
}
