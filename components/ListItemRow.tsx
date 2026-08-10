'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { moveListItem, removeListItem } from '@/lib/actions/lists';
import type { MediaItem, MediaListItem } from '@/lib/generated/prisma';

type ItemWithMedia = MediaListItem & { mediaItem: MediaItem };

export default function ListItemRow({
  item,
  index,
  mediaListId,
  isRanked,
  canEdit,
  isFirst,
  isLast,
}: {
  item: ItemWithMedia;
  index: number;
  mediaListId: string;
  isRanked: boolean;
  canEdit: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
      {isRanked && <span className="w-6 text-center text-sm font-semibold text-slate-400">{index + 1}</span>}
      <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
        {item.mediaItem.coverImageUrl && (
          <Image
            src={item.mediaItem.coverImageUrl}
            alt={item.mediaItem.title}
            fill
            sizes="44px"
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.mediaItem.title}</p>
        {item.mediaItem.releaseYear && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{item.mediaItem.releaseYear}</p>
        )}
      </div>
      {canEdit && isRanked && (
        <div className="flex flex-col">
          <button
            type="button"
            disabled={isPending || isFirst}
            onClick={() => startTransition(() => moveListItem({ mediaListId, itemId: item.id, direction: 'up' }))}
            className="text-slate-400 hover:text-slate-700 disabled:opacity-30 dark:hover:text-slate-200"
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={isPending || isLast}
            onClick={() => startTransition(() => moveListItem({ mediaListId, itemId: item.id, direction: 'down' }))}
            className="text-slate-400 hover:text-slate-700 disabled:opacity-30 dark:hover:text-slate-200"
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
      {canEdit && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => removeListItem({ id: item.id, mediaListId }))}
          className="text-slate-400 hover:text-red-600"
          aria-label="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
