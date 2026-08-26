import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import ExperienceCard from '@/components/ExperienceCard';

export default async function FeedPage() {
  const userId = await requireUserId();

  const following = await getDb().follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  const experiences =
    followingIds.length === 0
      ? []
      : await getDb().experience.findMany({
          where: { userId: { in: followingIds } },
          include: {
            user: true,
            photos: { orderBy: { position: 'asc' } },
            likes: { where: { userId } },
            _count: { select: { likes: true } },
          },
          orderBy: { experiencedAt: 'desc' },
          take: 50,
        });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Feed</h1>

      {followingIds.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          You&apos;re not following anyone yet. Visit a profile to follow them.
        </p>
      )}
      {followingIds.length > 0 && experiences.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">No experiences logged yet by people you follow.</p>
      )}

      <div className="space-y-3">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}
