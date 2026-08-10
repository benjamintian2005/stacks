'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function toggleLike(diaryEntryId: string, mediaItemId: string) {
  const userId = await requireUserId();

  const existing = await getDb().like.findUnique({
    where: { userId_diaryEntryId: { userId, diaryEntryId } },
  });

  if (existing) {
    await getDb().like.delete({ where: { userId_diaryEntryId: { userId, diaryEntryId } } });
  } else {
    await getDb().like.create({ data: { userId, diaryEntryId } });
  }

  revalidatePath(`/media/${mediaItemId}`);
}
