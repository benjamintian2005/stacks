import { Link, useParams } from 'react-router-dom';
import { useUserProfileByUsername } from '../hooks/useUserProfileByUsername';
import FollowButton from '../components/FollowButton';

export default function ProfilePage() {
  const { username } = useParams();
  const { data: profile, isLoading } = useUserProfileByUsername(username);

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  if (!profile) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">User not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">@{profile.username}</p>
        </div>
        <FollowButton targetUserId={profile.id} />
      </div>
      {profile.bio && <p className="mt-4 text-slate-700 dark:text-slate-300">{profile.bio}</p>}

      <div className="mt-6 flex gap-3">
        <Link
          to={`/u/${profile.username}/lists`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Lists
        </Link>
      </div>
    </div>
  );
}
