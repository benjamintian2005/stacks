'use server';

import { requireUserId } from '@/lib/auth';
import { searchMedia, type SearchResult } from '@/lib/search';
import type { MediaType } from '@/lib/types';

export async function searchMediaAction(mediaType: MediaType, query: string): Promise<SearchResult[]> {
  await requireUserId();

  try {
    return await searchMedia(mediaType, query);
  } catch (err) {
    // Third-party metadata APIs are best-effort (rate limits, outages) — log for our own
    // diagnosis via `vercel logs`, but don't blow up the search UI over a transient failure.
    console.error(`searchMedia(${mediaType}) failed:`, err);
    return [];
  }
}
