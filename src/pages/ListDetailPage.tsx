import { useParams } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { client } from '../lib/amplifyClient';
import { useListItems, useListItemMutations } from '../hooks/useMediaListItems';
import AddToListSearch from '../components/AddToListSearch';

export default function ListDetailPage() {
  const { listId } = useParams();

  const listQuery = useQuery({
    queryKey: ['mediaList', listId],
    queryFn: async () => {
      if (!listId) return null;
      const { data } = await client.models.MediaList.get({ id: listId });
      return data;
    },
    enabled: !!listId,
  });

  const { data: items = [], isLoading: isItemsLoading } = useListItems(listId);
  const { addItem, removeItem, moveItem } = useListItemMutations(listId ?? '');

  const mediaItemQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ['mediaItem', item.mediaItemId],
      queryFn: async () => {
        const { data } = await client.models.MediaItem.get({ id: item.mediaItemId });
        return data;
      },
    })),
  });

  if (listQuery.isLoading) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  const list = listQuery.data;
  if (!list) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{list.title}</h1>
      {list.description && <p className="mt-1 text-slate-500 dark:text-slate-400">{list.description}</p>}

      <div className="mt-6 space-y-2">
        {isItemsLoading && <p className="text-slate-500 dark:text-slate-400">Loading items…</p>}
        {!isItemsLoading && items.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">This list is empty. Add something below.</p>
        )}
        {items.map((item, index) => {
          const media = mediaItemQueries[index]?.data;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800"
            >
              {list.isRanked && (
                <span className="w-6 text-center text-sm font-semibold text-slate-400">{index + 1}</span>
              )}
              <div className="h-16 w-11 shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                {media?.coverImageUrl && (
                  <img src={media.coverImageUrl} alt={media.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{media?.title ?? '…'}</p>
                {media?.releaseYear && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{media.releaseYear}</p>
                )}
              </div>
              {list.isRanked && (
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveItem.mutate({ items, index, direction: 'up' })}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem.mutate({ items, index, direction: 'down' })}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeItem.mutate(item.id)}
                className="text-slate-400 hover:text-red-600"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <AddToListSearch onAdd={(mediaItemId) => addItem.mutate({ mediaItemId, nextPosition: items.length })} />
      </div>
    </div>
  );
}
