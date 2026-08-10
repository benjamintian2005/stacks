import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import DiaryEntryCard from '@/components/DiaryEntryCard';

export default async function UserDiaryPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userId = await requireUserId();

  const profile = await getDb().profile.findUnique({ where: { username } });
  if (!profile) {
    notFound();
  }

  const entries = await getDb().diaryEntry.findMany({
    where: { userId: profile.id },
    include: {
      user: true,
      mediaItem: true,
      _count: { select: { likes: true } },
      likes: { where: { userId }, select: { userId: true } },
    },
    orderBy: { loggedDate: 'desc' },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">@{profile.username}&apos;s diary</h1>

      {entries.length === 0 && <p className="text-slate-500 dark:text-slate-400">No entries yet.</p>}

      <div className="space-y-3">
        {entries.map((entry) => (
          <DiaryEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
