'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function followUser(targetUserId: string) {
  const userId = await requireUserId();
  if (userId === targetUserId) return;

  await getDb().follow.upsert({
    where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
    update: {},
    create: { followerId: userId, followingId: targetUserId },
  });

  await getDb().activityEvent.create({
    data: { actorId: userId, eventType: 'FOLLOWED_USER', targetUserId },
  });

  revalidatePath('/feed');
}

export async function unfollowUser(targetUserId: string) {
  const userId = await requireUserId();
  await getDb().follow.deleteMany({ where: { followerId: userId, followingId: targetUserId } });
  revalidatePath('/feed');
}
