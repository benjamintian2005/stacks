import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useLibraryEntry } from '../hooks/useLibraryEntry';
import { useDiaryEntries } from '../hooks/useDiaryEntries';
import StarRating from '../components/StarRating';
import LogEntryForm from '../components/LogEntryForm';
import DiaryEntryCard from '../components/DiaryEntryCard';
import { LIBRARY_STATUS_LABELS, type LibraryStatus } from '../types/media';

const STATUS_OPTIONS: LibraryStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'];

export default function MediaDetailPage() {
  const { mediaItemId } = useParams();

  const mediaQuery = useQuery({
    queryKey: ['mediaItem', mediaItemId],
    queryFn: async () => {
      if (!mediaItemId) return null;
      const { data } = await client.models.MediaItem.get({ id: mediaItemId });
      return data;
    },
    enabled: !!mediaItemId,
  });

  const { entry, upsert, isUpserting } = useLibraryEntry(mediaItemId);
  const { entries: diaryEntries, isLoading: isDiaryLoading, logEntry, isLogging } = useDiaryEntries(mediaItemId);

  if (mediaQuery.isLoading) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  const media = mediaQuery.data;
  if (!media) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-48 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          {media.coverImageUrl ? (
            <img src={media.coverImageUrl} alt={media.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center text-xs text-slate-400">No cover</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{media.title}</h1>
          {media.releaseYear && <p className="text-slate-500 dark:text-slate-400">{media.releaseYear}</p>}
          {media.description && <p className="mt-4 text-slate-700 dark:text-slate-300">{media.description}</p>}

          <div className="mt-6 space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div>
              <label
                htmlFor="library-status"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Status
              </label>
              <select
                id="library-status"
                value={entry?.status ?? ''}
                disabled={isUpserting}
                onChange={(e) => upsert({ status: e.target.value as LibraryStatus, rating: entry?.rating })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="" disabled>
                  Add to your library…
                </option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {LIBRARY_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            {entry && (
              <div>
                <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Your rating</p>
                <StarRating
                  value={entry.rating ?? null}
                  disabled={isUpserting}
                  onChange={(rating) => upsert({ status: entry.status, rating })}
                />
              </div>
            )}
          </div>

          <div className="mt-6">
            <LogEntryForm
              isSubmitting={isLogging}
              onSubmit={(values) =>
                mediaItemId &&
                logEntry({
                  mediaItemId,
                  rating: values.rating,
                  reviewText: values.reviewText,
                  loggedDate: values.loggedDate,
                  containsSpoilers: values.containsSpoilers,
                  rewatch: values.rewatch,
                })
              }
            />
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Log entries</h2>
            {isDiaryLoading && <p className="text-slate-500 dark:text-slate-400">Loading…</p>}
            {!isDiaryLoading && diaryEntries.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">No one has logged this yet.</p>
            )}
            <div className="space-y-3">
              {diaryEntries.map((diaryEntry) => (
                <DiaryEntryCard key={diaryEntry.id} entry={diaryEntry} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
