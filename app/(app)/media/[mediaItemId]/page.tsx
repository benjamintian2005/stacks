import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import LibraryControls from '@/components/LibraryControls';
import LogEntryForm from '@/components/LogEntryForm';
import DiaryEntryCard from '@/components/DiaryEntryCard';

export default async function MediaDetailPage({ params }: { params: Promise<{ mediaItemId: string }> }) {
  const { mediaItemId } = await params;
  const userId = await requireUserId();

  const [media, libraryEntry, diaryEntries] = await Promise.all([
    getDb().mediaItem.findUnique({ where: { id: mediaItemId } }),
    getDb().libraryEntry.findUnique({ where: { userId_mediaItemId: { userId, mediaItemId } } }),
    getDb().diaryEntry.findMany({
      where: { mediaItemId },
      include: {
        user: true,
        _count: { select: { likes: true } },
        likes: { where: { userId }, select: { userId: true } },
      },
      orderBy: { loggedDate: 'desc' },
    }),
  ]);

  if (!media) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-72 w-48 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          {media.coverImageUrl ? (
            <Image src={media.coverImageUrl} alt={media.title} fill sizes="200px" className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">No cover</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{media.title}</h1>
          {media.releaseYear && <p className="text-slate-500 dark:text-slate-400">{media.releaseYear}</p>}
          {media.description && <p className="mt-4 text-slate-700 dark:text-slate-300">{media.description}</p>}

          <LibraryControls mediaItemId={media.id} initialEntry={libraryEntry} />

          <div className="mt-6">
            <LogEntryForm mediaItemId={media.id} />
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Log entries</h2>
            {diaryEntries.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">No one has logged this yet.</p>
            )}
            <div className="space-y-3">
              {diaryEntries.map((entry) => (
                <DiaryEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
