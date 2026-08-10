'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { searchMediaAction } from '@/lib/actions/search';
import { addOrGetMediaItem } from '@/lib/actions/media';
import MediaCard from './MediaCard';
import type { MediaType } from '@/lib/types';
import type { SearchResult } from '@/lib/search';

const DEBOUNCE_MS = 300;

export default function SearchBox({ mediaType }: { mediaType: MediaType }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [isOpening, startOpenTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const runSearch = (value: string) => {
    startSearchTransition(async () => {
      try {
        setResults(await searchMediaAction(mediaType, value));
      } catch {
        setError('Something went wrong. Try again.');
      }
    });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => runSearch(value), DEBOUNCE_MS);
  };

  const handleSelect = (result: SearchResult) => {
    setError(null);
    startOpenTransition(async () => {
      try {
        const mediaItem = await addOrGetMediaItem(result);
        router.push(`/media/${mediaItem.id}`);
      } catch {
        setError("Couldn't open that title. Try again.");
      }
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search…"
        className="mb-6 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      {isSearching && <p className="text-slate-500 dark:text-slate-400">Searching…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {results.map((result) => (
          <MediaCard
            key={`${result.externalSource}-${result.externalId}`}
            media={result}
            disabled={isOpening}
            onClick={() => handleSelect(result)}
          />
        ))}
      </div>
    </div>
  );
}
