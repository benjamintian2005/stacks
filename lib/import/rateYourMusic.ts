import * as cheerio from 'cheerio';
import type { ScrapedItem } from './types';

const IMPORT_USER_AGENT = 'Mozilla/5.0 (compatible; Stacks-MediaTracker-Import/0.1)';
const MAX_PAGES = 5; // bounds Lambda runtime; RateYourMusic collections can run to many pages

export const extractRymUsername = (input: string): string => {
  const collectionMatch = input.match(/rateyourmusic\.com\/collection\/([^/]+)/i);
  if (collectionMatch) return collectionMatch[1];
  const tildeMatch = input.match(/~([^/\s]+)/);
  if (tildeMatch) return tildeMatch[1];
  return input.trim();
};

/** Best-effort HTML scrape, ported from the MediaParser reference project — same caveats as Goodreads. */
export const parseRateYourMusicPage = (html: string): ScrapedItem[] => {
  const $ = cheerio.load(html);
  const items: ScrapedItem[] = [];

  $('div.or_q_albumartist').each((_, block) => {
    const album = $(block).find('a.album').first().text().trim();
    const artist = $(block).find('a.artist').first().text().trim();
    // .rating_num lives in the same enclosing block as the album/artist links, not inside or_q_albumartist itself.
    const ratingText = $(block).parent().find('.rating_num').first().text().trim();
    const rating = ratingText ? Number(ratingText) : null;

    if (album) {
      items.push({
        title: artist ? `${artist} - ${album}` : album,
        rating: rating != null && Number.isFinite(rating) ? rating : null,
        platform: 'RATEYOURMUSIC',
      });
    }
  });

  return items;
};

export const parseRateYourMusic = async (sourceUrl: string): Promise<ScrapedItem[]> => {
  const username = extractRymUsername(sourceUrl);
  const allItems: ScrapedItem[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await fetch(`https://rateyourmusic.com/collection/${username}/r/${page}/`, {
      headers: { 'User-Agent': IMPORT_USER_AGENT },
    });
    if (!response.ok) break;

    const pageItems = parseRateYourMusicPage(await response.text());
    if (pageItems.length === 0) break;

    allItems.push(...pageItems);
  }

  return allItems;
};
