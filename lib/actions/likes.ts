'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function toggleLike(experienceId: string) {
  const userId = await requireUserId();

  const existing = await getDb().like.findUnique({
    where: { userId_experienceId: { userId, experienceId } },
  });

  if (existing) {
    await getDb().like.delete({ where: { userId_experienceId: { userId, experienceId } } });
  } else {
    await getDb().like.create({ data: { userId, experienceId } });
  }

  revalidatePath(`/experience/${experienceId}`);
  revalidatePath('/feed');
}
