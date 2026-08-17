import { XMLParser } from 'fast-xml-parser';
import type { ScrapedItem } from './types';

export const extractLetterboxdUsername = (input: string): string => {
  const match = input.match(/letterboxd\.com\/([^/]+)/i);
  return (match ? match[1] : input).trim();
};

type LetterboxdRssItem = {
  'letterboxd:filmtitle'?: string;
  'letterboxd:memberrating'?: string | number;
  title?: string;
};

export const parseLetterboxdRss = (xml: string): ScrapedItem[] => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as { rss?: { channel?: { item?: LetterboxdRssItem | LetterboxdRssItem[] } } };
  const rawItems = parsed?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.map((item) => {
    const title = item['letterboxd:filmtitle'] ?? item.title ?? 'Untitled';
    const ratingRaw = item['letterboxd:memberrating'];
    const rating = ratingRaw != null ? Number(ratingRaw) : null;
    return {
      title: String(title),
      rating: rating != null && Number.isFinite(rating) ? rating : null,
      platform: 'LETTERBOXD' as const,
    };
  });
};

export const parseLetterboxd = async (sourceUrl: string): Promise<ScrapedItem[]> => {
  const username = extractLetterboxdUsername(sourceUrl);
  const response = await fetch(`https://letterboxd.com/${username}/rss/`, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`Letterboxd RSS fetch failed with status ${response.status}`);
  }
  return parseLetterboxdRss(await response.text());
};
