import { Link, useParams } from 'react-router-dom';
import { useUserProfileByUsername } from '../hooks/useUserProfileByUsername';
import { useListsByCreator } from '../hooks/useMediaLists';
import { useAuthUser } from '../hooks/useAuthUser';

export default function ListsPage() {
  const { username } = useParams();
  const { data: profile, isLoading: isProfileLoading } = useUserProfileByUsername(username);
  const { data: lists = [], isLoading: isListsLoading } = useListsByCreator(profile?.id);
  const { userId } = useAuthUser();
  const isOwnProfile = profile?.id === userId;

  if (isProfileLoading) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  if (!profile) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">User not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">@{profile.username}&apos;s lists</h1>
        {isOwnProfile && (
          <Link
            to="/lists/new"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            New list
          </Link>
        )}
      </div>

      {isListsLoading && <p className="text-slate-500 dark:text-slate-400">Loading…</p>}
      {!isListsLoading && lists.length === 0 && <p className="text-slate-500 dark:text-slate-400">No lists yet.</p>}

      <div className="space-y-3">
        {lists.map((list) => (
          <Link
            key={list.id}
            to={`/lists/${list.id}`}
            className="block rounded-lg border border-slate-200 p-4 hover:border-indigo-300 dark:border-slate-800"
          >
            <p className="font-medium text-slate-900 dark:text-white">{list.title}</p>
            {list.description && <p className="text-sm text-slate-500 dark:text-slate-400">{list.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
