import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';
import { mediaTypeFromSlug, MEDIA_TYPE_LABELS, LIBRARY_STATUS_LABELS } from '@/lib/types';

export default async function UserLibraryPage({
  params,
}: {
  params: Promise<{ username: string; mediaTypeSlug: string }>;
}) {
  const { username, mediaTypeSlug } = await params;
  const mediaType = mediaTypeFromSlug(mediaTypeSlug);
  if (!mediaType) {
    notFound();
  }

  const profile = await getDb().profile.findUnique({ where: { username } });
  if (!profile) {
    notFound();
  }

  const entries = await getDb().libraryEntry.findMany({
    where: { userId: profile.id, mediaItem: { mediaType } },
    include: { mediaItem: true },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
        @{profile.username}&apos;s {MEDIA_TYPE_LABELS[mediaType]}
      </h1>

      {entries.length === 0 && <p className="text-slate-500 dark:text-slate-400">Nothing here yet.</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {entries.map((entry) => (
          <Link key={entry.id} href={`/media/${entry.mediaItemId}`} className="block">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-800">
                {entry.mediaItem.coverImageUrl && (
                  <Image
                    src={entry.mediaItem.coverImageUrl}
                    alt={entry.mediaItem.title}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{entry.mediaItem.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {LIBRARY_STATUS_LABELS[entry.status]}
                  {entry.rating != null ? ` · ${(entry.rating / 2).toFixed(1)}★` : ''}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
