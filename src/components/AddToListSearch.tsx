import { useState } from 'react';
import { useSearchMedia } from '../hooks/useSearchMedia';
import { useAddOrGetMediaItem } from '../hooks/useAddOrGetMediaItem';
import MediaCard from './MediaCard';
import { IMPLEMENTED_MEDIA_TYPES, MEDIA_TYPE_LABELS, type MediaSearchResult, type MediaType } from '../types/media';

export default function AddToListSearch({ onAdd }: { onAdd: (mediaItemId: string) => void }) {
  const [mediaType, setMediaType] = useState<MediaType>('MOVIE');
  const [query, setQuery] = useState('');
  const searchQuery = useSearchMedia(mediaType, query);
  const openMedia = useAddOrGetMediaItem();

  const handleAdd = (result: MediaSearchResult) => {
    openMedia.mutate(result, { onSuccess: (mediaItem) => onAdd(mediaItem.id) });
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">Add to list</h3>
      <div className="mb-3 flex gap-2">
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as MediaType)}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {IMPLEMENTED_MEDIA_TYPES.map((type) => (
            <option key={type} value={type}>
              {MEDIA_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      {searchQuery.isLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Searching…</p>}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {(searchQuery.data ?? [])
          .filter((result): result is MediaSearchResult => result != null)
          .map((result) => (
            <MediaCard
              key={`${result.externalSource}-${result.externalId}`}
              media={result}
              onClick={() => handleAdd(result)}
            />
          ))}
      </div>
    </div>
  );
}
