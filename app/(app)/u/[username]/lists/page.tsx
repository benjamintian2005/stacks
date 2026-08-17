import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';

export default async function UserListsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const userId = await requireUserId();

  const profile = await getDb().profile.findUnique({ where: { username } });
  if (!profile) {
    notFound();
  }

  const lists = await getDb().mediaList.findMany({
    where: { creatorId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const isOwnProfile = profile.id === userId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">@{profile.username}&apos;s lists</h1>
        {isOwnProfile && (
          <Link
            href="/lists/new"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            New list
          </Link>
        )}
      </div>

      {lists.length === 0 && <p className="text-slate-500 dark:text-slate-400">No lists yet.</p>}

      <div className="space-y-3">
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/lists/${list.id}`}
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
