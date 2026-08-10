import * as cheerio from 'cheerio';
import type { ScrapedItem } from './types';

const IMPORT_USER_AGENT = 'Mozilla/5.0 (compatible; Stacks-MediaTracker-Import/0.1)';

export const buildGoodreadsUrl = (input: string): string => {
  if (/^https?:\/\//i.test(input)) {
    return input;
  }
  return `https://www.goodreads.com/review/list/${input.trim()}`;
};

/**
 * Best-effort HTML scrape, ported from the MediaParser reference project. Goodreads' shelf markup
 * isn't a stable public API, so this is explicitly experimental and expected to need upkeep if it breaks.
 */
export const parseGoodreadsHtml = (html: string): ScrapedItem[] => {
  const $ = cheerio.load(html);
  const items: ScrapedItem[] = [];

  $('tr.bookalike.review').each((_, row) => {
    const title = $(row).find('td.field.title a').first().text().trim();
    if (!title) return;

    // Goodreads renders static ratings as e.g. class="staticStars p100" (p-value = rating * 20).
    const starsClass = $(row).find('td.field.rating .staticStars').attr('class') ?? '';
    const match = starsClass.match(/\bp(\d{1,3})\b/);
    const rating = match ? Number(match[1]) / 20 : null;

    items.push({ title, rating, platform: 'GOODREADS' });
  });

  return items;
};

export const parseGoodreads = async (sourceUrl: string): Promise<ScrapedItem[]> => {
  const url = buildGoodreadsUrl(sourceUrl);
  const response = await fetch(url, { headers: { 'User-Agent': IMPORT_USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Goodreads fetch failed with status ${response.status}`);
  }
  return parseGoodreadsHtml(await response.text());
};
