import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import FollowButton from '@/components/FollowButton';
import ExperienceCard from '@/components/ExperienceCard';

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

  const experiences = await getDb().experience.findMany({
    where: { userId: profile.id },
    include: {
      user: true,
      photos: { orderBy: { position: 'asc' } },
      likes: { where: { userId } },
      _count: { select: { likes: true } },
    },
    orderBy: { experiencedAt: 'desc' },
    take: 30,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
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

      <div className="mt-8 space-y-3">
        {experiences.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">No experiences logged yet.</p>
        )}
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}
