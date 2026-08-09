import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import type { Schema } from '../../amplify/data/resource';

type ActivityEvent = Schema['ActivityEvent']['type'];

type ActivityDetail =
  | { kind: 'media'; title: string; mediaItemId: string }
  | { kind: 'list'; title: string; listId: string }
  | { kind: 'user'; username: string };

export default function ActivityFeedItem({ event }: { event: ActivityEvent }) {
  const actorQuery = useQuery({
    queryKey: ['userProfile', event.actorId],
    queryFn: async () => (await client.models.UserProfile.get({ id: event.actorId })).data,
  });

  const detailQuery = useQuery({
    queryKey: ['activityDetail', event.id],
    queryFn: async (): Promise<ActivityDetail | null> => {
      if (event.eventType === 'LOGGED_DIARY' && event.mediaItemId) {
        const { data } = await client.models.MediaItem.get({ id: event.mediaItemId });
        if (!data) return null;
        return { kind: 'media', title: data.title, mediaItemId: data.id };
      }
      if (event.eventType === 'CREATED_LIST' && event.mediaListId) {
        const { data } = await client.models.MediaList.get({ id: event.mediaListId });
        if (!data) return null;
        return { kind: 'list', title: data.title, listId: data.id };
      }
      if (event.eventType === 'FOLLOWED_USER' && event.targetUserId) {
        const { data } = await client.models.UserProfile.get({ id: event.targetUserId });
        if (!data) return null;
        return { kind: 'user', username: data.username };
      }
      return null;
    },
  });

  const actorUsername = actorQuery.data?.username;
  const detail = detailQuery.data;

  return (
    <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
      {actorUsername ? (
        <Link to={`/u/${actorUsername}`} className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white">
          @{actorUsername}
        </Link>
      ) : (
        <span className="font-medium text-slate-400">…</span>
      )}{' '}
      <span className="text-slate-600 dark:text-slate-400">
        {!detail && '…'}
        {detail?.kind === 'media' && (
          <>
            logged{' '}
            <Link to={`/media/${detail.mediaItemId}`} className="hover:text-indigo-600">
              {detail.title}
            </Link>
          </>
        )}
        {detail?.kind === 'list' && (
          <>
            created the list{' '}
            <Link to={`/lists/${detail.listId}`} className="hover:text-indigo-600">
              {detail.title}
            </Link>
          </>
        )}
        {detail?.kind === 'user' && (
          <>
            followed{' '}
            <Link to={`/u/${detail.username}`} className="hover:text-indigo-600">
              @{detail.username}
            </Link>
          </>
        )}
      </span>
    </div>
  );
}
