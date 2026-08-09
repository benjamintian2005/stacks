import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearchMedia } from '../hooks/useSearchMedia';
import { useAddOrGetMediaItem } from '../hooks/useAddOrGetMediaItem';
import MediaCard from '../components/MediaCard';
import {
  IMPLEMENTED_MEDIA_TYPES,
  MEDIA_TYPE_LABELS,
  mediaTypeFromSlug,
  type MediaSearchResult,
} from '../types/media';

export default function DiscoverPage() {
  const { mediaTypeSlug } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const mediaType = mediaTypeSlug ? mediaTypeFromSlug(mediaTypeSlug) : undefined;

  const searchQuery = useSearchMedia(mediaType ?? 'MOVIE', query);
  const openMedia = useAddOrGetMediaItem();
  const handleOpen = (result: MediaSearchResult) =>
    openMedia.mutate(result, { onSuccess: (mediaItem) => navigate(`/media/${mediaItem.id}`) });

  if (!mediaType) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500 dark:text-slate-400">
        Unknown category.
      </div>
    );
  }

  if (!IMPLEMENTED_MEDIA_TYPES.includes(mediaType)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{MEDIA_TYPE_LABELS[mediaType]}</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Search for {MEDIA_TYPE_LABELS[mediaType].toLowerCase()} is coming in a later phase.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
        Discover {MEDIA_TYPE_LABELS[mediaType]}
      </h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${MEDIA_TYPE_LABELS[mediaType].toLowerCase()}…`}
        className="mb-6 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      {searchQuery.isLoading && <p className="text-slate-500 dark:text-slate-400">Searching…</p>}
      {searchQuery.isError && <p className="text-red-600">Something went wrong. Try again.</p>}
      {openMedia.isError && <p className="text-red-600">Couldn't open that title. Try again.</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(searchQuery.data ?? [])
          .filter((result): result is MediaSearchResult => result != null)
          .map((result) => (
            <MediaCard
              key={`${result.externalSource}-${result.externalId}`}
              media={result}
              onClick={() => handleOpen(result)}
            />
          ))}
      </div>
    </div>
  );
}
