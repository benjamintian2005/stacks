'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function addComment(input: { experienceId: string; text: string }) {
  const userId = await requireUserId();
  const text = input.text.trim();
  if (!text) {
    return;
  }

  await getDb().comment.create({ data: { userId, experienceId: input.experienceId, text } });
  revalidatePath(`/experience/${input.experienceId}`);
  revalidatePath('/feed');
}
