import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import FollowButton from '@/components/FollowButton';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userId = await requireUserId();
  const profile = await getDb().profile.findUnique({ where: { username } });

  if (!profile) {
    notFound();
  }

  const isOwnProfile = profile.id === userId;
  const following = isOwnProfile
    ? null
    : await getDb().follow.findUnique({
        where: { followerId_followingId: { followerId: userId, followingId: profile.id } },
      });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">@{profile.username}</p>
        </div>
        {!isOwnProfile && <FollowButton targetUserId={profile.id} initialIsFollowing={!!following} />}
      </div>
      {profile.bio && <p className="mt-4 text-slate-700 dark:text-slate-300">{profile.bio}</p>}

      <div className="mt-6 flex gap-3">
        <Link
          href={`/u/${profile.username}/lists`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Lists
        </Link>
      </div>
    </div>
  );
}
