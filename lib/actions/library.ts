'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';
import type { LibraryStatus } from '@/lib/types';

type UpsertLibraryEntryInput = {
  mediaItemId: string;
  status: LibraryStatus;
  rating?: number | null;
};

export async function upsertLibraryEntry(input: UpsertLibraryEntryInput) {
  const userId = await requireUserId();

  const entry = await getDb().libraryEntry.upsert({
    where: { userId_mediaItemId: { userId, mediaItemId: input.mediaItemId } },
    update: { status: input.status, rating: input.rating ?? undefined },
    create: { userId, mediaItemId: input.mediaItemId, status: input.status, rating: input.rating ?? undefined },
  });

  revalidatePath(`/media/${input.mediaItemId}`);
  return entry;
}
