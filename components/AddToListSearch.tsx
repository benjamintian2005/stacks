'use client';

import { useRef, useState, useTransition } from 'react';
import { searchMediaAction } from '@/lib/actions/search';
import { addOrGetMediaItem } from '@/lib/actions/media';
import { addListItem } from '@/lib/actions/lists';
import MediaCard from './MediaCard';
import { ALL_MEDIA_TYPES, MEDIA_TYPE_LABELS, type MediaType } from '@/lib/types';
import type { SearchResult } from '@/lib/search';

const DEBOUNCE_MS = 300;

export default function AddToListSearch({ mediaListId }: { mediaListId: string }) {
  const [mediaType, setMediaType] = useState<MediaType>('MOVIE');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [isAdding, startAddTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = (type: MediaType, value: string) => {
    startSearchTransition(async () => {
      setResults(await searchMediaAction(type, value));
    });
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(mediaType, value), DEBOUNCE_MS);
  };

  const handleTypeChange = (type: MediaType) => {
    setMediaType(type);
    if (query.trim().length >= 2) runSearch(type, query);
  };

  const handleAdd = (result: SearchResult) => {
    startAddTransition(async () => {
      const mediaItem = await addOrGetMediaItem(result);
      await addListItem({ mediaListId, mediaItemId: mediaItem.id });
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">Add to list</h3>
      <div className="mb-3 flex gap-2">
        <select
          value={mediaType}
          onChange={(e) => handleTypeChange(e.target.value as MediaType)}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {ALL_MEDIA_TYPES.map((type) => (
            <option key={type} value={type}>
              {MEDIA_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      {isSearching && <p className="text-sm text-slate-500 dark:text-slate-400">Searching…</p>}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {results.map((result) => (
          <MediaCard
            key={`${result.externalSource}-${result.externalId}`}
            media={result}
            disabled={isAdding}
            onClick={() => handleAdd(result)}
          />
        ))}
      </div>
    </div>
  );
}
