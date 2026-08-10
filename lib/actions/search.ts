'use server';

import { requireUserId } from '@/lib/auth';
import { searchMedia, type SearchResult } from '@/lib/search';
import type { MediaType } from '@/lib/types';

export async function searchMediaAction(mediaType: MediaType, query: string): Promise<SearchResult[]> {
  await requireUserId();
  return searchMedia(mediaType, query);
}
