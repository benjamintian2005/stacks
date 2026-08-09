import type { Schema } from '../../data/resource';
import { parseLetterboxd } from './letterboxd';
import { parseGoodreads } from './goodreads';
import { parseRateYourMusic } from './rateYourMusic';

export const handler: Schema['startImport']['functionHandler'] = async (event) => {
  const { sourcePlatform, sourceUrl } = event.arguments;

  switch (sourcePlatform) {
    case 'LETTERBOXD':
      return parseLetterboxd(sourceUrl);
    case 'GOODREADS':
      return parseGoodreads(sourceUrl);
    case 'RATEYOURMUSIC':
      return parseRateYourMusic(sourceUrl);
    default:
      return [];
  }
};
