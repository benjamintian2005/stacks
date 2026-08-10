'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { searchMediaAction } from '@/lib/actions/search';
import { addOrGetMediaItem } from '@/lib/actions/media';
import { confirmImportMatch } from '@/lib/actions/import';
import MediaCard from './MediaCard';
import type { MediaType } from '@/lib/types';
import type { SearchResult } from '@/lib/search';

const DEBOUNCE_MS = 300;

export default function ImportMatchRow({
  title,
  rating,
  mediaType,
}: {
  title: string;
  rating: number | null;
  mediaType: MediaType;
}) {
  const [query, setQuery] = useState(title);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(true); // searches immediately on mount, below
  const [isConfirming, setIsConfirming] = useState(false);
  const [matchedTitle, setMatchedTitle] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    searchMediaAction(mediaType, title).then((data) => {
      if (!cancelled) {
        setResults(data);
        setIsSearching(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // Only run once on mount, seeded with the initial scraped title.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setResults(await searchMediaAction(mediaType, value));
      setIsSearching(false);
    }, DEBOUNCE_MS);
  };

  const handleConfirm = async (result: SearchResult) => {
    setIsConfirming(true);
    const mediaItem = await addOrGetMediaItem(result);
    await confirmImportMatch({ mediaItemId: mediaItem.id, rating });
    setMatchedTitle(mediaItem.title);
    setIsConfirming(false);
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
        onChange={(e) => handleQueryChange(e.target.value)}
        className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      {isSearching && <p className="text-xs text-slate-500 dark:text-slate-400">Searching…</p>}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {results.slice(0, 6).map((result) => (
          <MediaCard
            key={`${result.externalSource}-${result.externalId}`}
            media={result}
            disabled={isConfirming}
            onClick={() => handleConfirm(result)}
          />
        ))}
      </div>
    </div>
  );
}
