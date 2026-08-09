import { useQueries } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from '../hooks/useAuthUser';
import { useFollowingIds } from '../hooks/useFollow';
import ActivityFeedItem from '../components/ActivityFeedItem';

export default function FeedPage() {
  const { userId } = useAuthUser();
  const { data: followingIds = [], isLoading: isFollowingLoading } = useFollowingIds(userId ?? undefined);

  const eventQueries = useQueries({
    queries: followingIds.map((actorId) => ({
      queryKey: ['activityEvents', actorId],
      queryFn: async () => {
        const { data } = await client.models.ActivityEvent.listActivityEventByActorId({ actorId });
        return data;
      },
    })),
  });

  const isLoadingEvents = eventQueries.some((q) => q.isLoading);
  const events = eventQueries
    .flatMap((q) => q.data ?? [])
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 50);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Activity feed</h1>

      {!isFollowingLoading && followingIds.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          You're not following anyone yet. Visit a profile to follow them.
        </p>
      )}

      {(isFollowingLoading || isLoadingEvents) && followingIds.length > 0 && (
        <p className="text-slate-500 dark:text-slate-400">Loading…</p>
      )}

      {!isLoadingEvents && followingIds.length > 0 && events.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">No activity yet.</p>
      )}

      <div className="space-y-2">
        {events.map((event) => (
          <ActivityFeedItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
