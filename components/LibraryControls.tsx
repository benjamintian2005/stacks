'use client';

import { useState, useTransition } from 'react';
import { upsertLibraryEntry } from '@/lib/actions/library';
import StarRating from './StarRating';
import { LIBRARY_STATUSES, LIBRARY_STATUS_LABELS } from '@/lib/types';
import type { LibraryStatus } from '@/lib/types';
import type { LibraryEntry } from '@/lib/generated/prisma';

export default function LibraryControls({
  mediaItemId,
  initialEntry,
}: {
  mediaItemId: string;
  initialEntry: LibraryEntry | null;
}) {
  const [entry, setEntry] = useState(initialEntry);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: LibraryStatus) => {
    startTransition(async () => {
      const updated = await upsertLibraryEntry({ mediaItemId, status, rating: entry?.rating ?? null });
      setEntry(updated);
    });
  };

  const handleRatingChange = (rating: number) => {
    if (!entry) return;
    startTransition(async () => {
      const updated = await upsertLibraryEntry({ mediaItemId, status: entry.status, rating });
      setEntry(updated);
    });
  };

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <label htmlFor="library-status" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Status
        </label>
        <select
          id="library-status"
          value={entry?.status ?? ''}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value as LibraryStatus)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="" disabled>
            Add to your library…
          </option>
          {LIBRARY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {LIBRARY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {entry && (
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Your rating</p>
          <StarRating value={entry.rating ?? null} disabled={isPending} onChange={handleRatingChange} />
        </div>
      )}
    </div>
  );
}
