import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireUserId, getCurrentProfile } from '@/lib/auth';
import { getDb } from '@/lib/db';
import ExperienceCard from '@/components/ExperienceCard';

export default async function HomePage() {
  const userId = await requireUserId();
  const profile = await getCurrentProfile();

  const experiences = await getDb().experience.findMany({
    where: { userId },
    include: {
      user: true,
      photos: { orderBy: { position: 'asc' } },
      likes: { where: { userId } },
      _count: { select: { likes: true } },
    },
    orderBy: { experiencedAt: 'desc' },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}
        </h1>
        <Link
          href="/log"
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Log an experience
        </Link>
      </div>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Your recently logged experiences.</p>

      <div className="mt-6 space-y-3">
        {experiences.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            You haven&apos;t logged anything yet.{' '}
            <Link href="/log" className="text-indigo-600 hover:underline">
              Log your first experience
            </Link>
            .
          </p>
        )}
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}
