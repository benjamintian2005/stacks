'use server';

import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';
import type { SearchResult } from '@/lib/search';

export async function addOrGetMediaItem(result: SearchResult) {
  await requireUserId();

  const existing = await getDb().mediaItem.findUnique({
    where: {
      externalSource_externalId: {
        externalSource: result.externalSource,
        externalId: result.externalId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return getDb().mediaItem.create({
    data: {
      mediaType: result.mediaType,
      title: result.title,
      releaseYear: result.releaseYear ?? undefined,
      coverImageUrl: result.coverImageUrl ?? undefined,
      description: result.description ?? undefined,
      creators: result.creators,
      externalSource: result.externalSource,
      externalId: result.externalId,
    },
  });
}
