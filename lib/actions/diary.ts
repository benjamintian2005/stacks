'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

type LogEntryInput = {
  mediaItemId: string;
  rating?: number | null;
  reviewText?: string;
  loggedDate: string; // yyyy-mm-dd
  containsSpoilers?: boolean;
  rewatch?: boolean;
};

export async function logDiaryEntry(input: LogEntryInput) {
  const userId = await requireUserId();

  const entry = await getDb().diaryEntry.create({
    data: {
      userId,
      mediaItemId: input.mediaItemId,
      rating: input.rating ?? undefined,
      reviewText: input.reviewText || undefined,
      loggedDate: new Date(input.loggedDate),
      containsSpoilers: input.containsSpoilers ?? false,
      rewatch: input.rewatch ?? false,
    },
    include: { user: true },
  });

  await getDb().activityEvent.create({
    data: { actorId: userId, eventType: 'LOGGED_DIARY', mediaItemId: input.mediaItemId, diaryEntryId: entry.id },
  });

  revalidatePath(`/media/${input.mediaItemId}`);
  return entry;
}
