import type { ReactNode } from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';

export default async function FeedPage() {
  const userId = await requireUserId();

  const following = await getDb().follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  const events =
    followingIds.length === 0
      ? []
      : await getDb().activityEvent.findMany({
          where: { actorId: { in: followingIds } },
          include: { actor: true },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });

  const mediaItemIds = events.filter((e) => e.mediaItemId).map((e) => e.mediaItemId!);
  const mediaListIds = events.filter((e) => e.mediaListId).map((e) => e.mediaListId!);
  const targetUserIds = events.filter((e) => e.targetUserId).map((e) => e.targetUserId!);

  const [mediaItems, mediaLists, targetUsers] = await Promise.all([
    mediaItemIds.length ? getDb().mediaItem.findMany({ where: { id: { in: mediaItemIds } } }) : [],
    mediaListIds.length ? getDb().mediaList.findMany({ where: { id: { in: mediaListIds } } }) : [],
    targetUserIds.length ? getDb().profile.findMany({ where: { id: { in: targetUserIds } } }) : [],
  ]);

  const mediaItemMap = new Map(mediaItems.map((m) => [m.id, m]));
  const mediaListMap = new Map(mediaLists.map((l) => [l.id, l]));
  const targetUserMap = new Map(targetUsers.map((u) => [u.id, u]));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Activity feed</h1>

      {followingIds.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          You&apos;re not following anyone yet. Visit a profile to follow them.
        </p>
      )}
      {followingIds.length > 0 && events.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">No activity yet.</p>
      )}

      <div className="space-y-2">
        {events.map((event) => {
          let detail: ReactNode = '…';

          if (event.eventType === 'LOGGED_DIARY' && event.mediaItemId) {
            const media = mediaItemMap.get(event.mediaItemId);
            if (media) {
              detail = (
                <>
                  logged{' '}
                  <Link href={`/media/${media.id}`} className="hover:text-indigo-600">
                    {media.title}
                  </Link>
                </>
              );
            }
          } else if (event.eventType === 'CREATED_LIST' && event.mediaListId) {
            const list = mediaListMap.get(event.mediaListId);
            if (list) {
              detail = (
                <>
                  created the list{' '}
                  <Link href={`/lists/${list.id}`} className="hover:text-indigo-600">
                    {list.title}
                  </Link>
                </>
              );
            }
          } else if (event.eventType === 'FOLLOWED_USER' && event.targetUserId) {
            const target = targetUserMap.get(event.targetUserId);
            if (target) {
              detail = (
                <>
                  followed{' '}
                  <Link href={`/u/${target.username}`} className="hover:text-indigo-600">
                    @{target.username}
                  </Link>
                </>
              );
            }
          }

          return (
            <div key={event.id} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
              <Link
                href={`/u/${event.actor.username}`}
                className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
              >
                @{event.actor.username}
              </Link>{' '}
              <span className="text-slate-600 dark:text-slate-400">{detail}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
