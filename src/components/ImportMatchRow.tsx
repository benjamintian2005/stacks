import { useState } from 'react';
import { Check } from 'lucide-react';
import { useSearchMedia } from '../hooks/useSearchMedia';
import { useAddOrGetMediaItem } from '../hooks/useAddOrGetMediaItem';
import { useAuthUser } from '../hooks/useAuthUser';
import { client } from '../lib/amplifyClient';
import MediaCard from './MediaCard';
import type { MediaSearchResult, MediaType } from '../types/media';

type ImportMatchRowProps = {
  title: string;
  rating: number | null; // 0-5 scale as scraped from the source platform
  mediaType: MediaType;
};

const today = () => new Date().toISOString().slice(0, 10);

export default function ImportMatchRow({ title, rating, mediaType }: ImportMatchRowProps) {
  const { userId } = useAuthUser();
  const [query, setQuery] = useState(title);
  const [matchedTitle, setMatchedTitle] = useState<string | null>(null);
  const searchQuery = useSearchMedia(mediaType, query);
  const openMedia = useAddOrGetMediaItem();

  const handleConfirm = (result: MediaSearchResult) => {
    openMedia.mutate(result, {
      onSuccess: async (mediaItem) => {
        if (!userId) return;
        const scaledRating = rating != null ? rating * 2 : undefined; // 0-5 -> our 0-10 half-point scale
        await client.models.LibraryEntry.create({
          id: `${userId}::${mediaItem.id}`,
          mediaItemId: mediaItem.id,
          status: 'COMPLETED',
          rating: scaledRating,
        });
        await client.models.DiaryEntry.create({
          mediaItemId: mediaItem.id,
          rating: scaledRating,
          loggedDate: today(),
        });
        setMatchedTitle(mediaItem.title);
      },
    });
  };

  if (matchedTitle) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
        <Check className="h-4 w-4" />
        Added &quot;{matchedTitle}&quot; to your library{rating != null ? ` with a ${rating}/5 rating` : ''}.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {title}
          {rating != null && <span className="ml-2 text-slate-500 dark:text-slate-400">{rating}/5</span>}
        </p>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      {searchQuery.isLoading && <p className="text-xs text-slate-500 dark:text-slate-400">Searching…</p>}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {(searchQuery.data ?? [])
          .filter((result): result is MediaSearchResult => result != null)
          .slice(0, 6)
          .map((result) => (
            <MediaCard
              key={`${result.externalSource}-${result.externalId}`}
              media={result}
              onClick={() => handleConfirm(result)}
            />
          ))}
      </div>
    </div>
  );
}
