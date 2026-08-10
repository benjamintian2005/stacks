'use server';

import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function createList(input: { title: string; description?: string; isRanked?: boolean }) {
  const userId = await requireUserId();

  const list = await getDb().mediaList.create({
    data: {
      creatorId: userId,
      title: input.title,
      description: input.description,
      isRanked: input.isRanked ?? false,
    },
  });

  await getDb().activityEvent.create({
    data: { actorId: userId, eventType: 'CREATED_LIST', mediaListId: list.id },
  });

  return list;
}

export async function addListItem(input: { mediaListId: string; mediaItemId: string }) {
  await requireUserId();

  const count = await getDb().mediaListItem.count({ where: { mediaListId: input.mediaListId } });
  const item = await getDb().mediaListItem.create({
    data: { mediaListId: input.mediaListId, mediaItemId: input.mediaItemId, position: count },
  });

  revalidatePath(`/lists/${input.mediaListId}`);
  return item;
}

export async function removeListItem(input: { id: string; mediaListId: string }) {
  await requireUserId();
  await getDb().mediaListItem.delete({ where: { id: input.id } });
  revalidatePath(`/lists/${input.mediaListId}`);
}

export async function moveListItem(input: { mediaListId: string; itemId: string; direction: 'up' | 'down' }) {
  await requireUserId();

  const items = await getDb().mediaListItem.findMany({
    where: { mediaListId: input.mediaListId },
    orderBy: { position: 'asc' },
  });

  const index = items.findIndex((item) => item.id === input.itemId);
  const targetIndex = input.direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= items.length) {
    return;
  }

  const current = items[index];
  const target = items[targetIndex];

  await getDb().$transaction([
    getDb().mediaListItem.update({ where: { id: current.id }, data: { position: target.position } }),
    getDb().mediaListItem.update({ where: { id: target.id }, data: { position: current.position } }),
  ]);

  revalidatePath(`/lists/${input.mediaListId}`);
}
