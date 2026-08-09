import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { computeSwap } from '../lib/listOrdering';

export function useListItems(mediaListId: string | undefined) {
  return useQuery({
    queryKey: ['mediaListItems', mediaListId],
    queryFn: async () => {
      if (!mediaListId) return [];
      const { data } = await client.models.MediaListItem.listMediaListItemByMediaListId({ mediaListId });
      return [...data].sort((a, b) => a.position - b.position);
    },
    enabled: !!mediaListId,
  });
}

export function useListItemMutations(mediaListId: string) {
  const queryClient = useQueryClient();
  const listItemsQueryKey = ['mediaListItems', mediaListId];
  const invalidate = () => queryClient.invalidateQueries({ queryKey: listItemsQueryKey });

  const addItem = useMutation({
    mutationFn: async ({ mediaItemId, nextPosition }: { mediaItemId: string; nextPosition: number }) => {
      const { data, errors } = await client.models.MediaListItem.create({
        mediaListId,
        mediaItemId,
        position: nextPosition,
      });
      if (errors?.length || !data) {
        throw new Error(errors?.map((e) => e.message).join('; ') ?? 'Failed to add to list');
      }
      return data;
    },
    onSuccess: invalidate,
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      await client.models.MediaListItem.delete({ id: itemId });
    },
    onSuccess: invalidate,
  });

  const moveItem = useMutation({
    mutationFn: async ({
      items,
      index,
      direction,
    }: {
      items: { id: string; position: number }[];
      index: number;
      direction: 'up' | 'down';
    }) => {
      const swap = computeSwap(items, index, direction);
      if (!swap) return;
      await Promise.all(swap.map((update) => client.models.MediaListItem.update(update)));
    },
    onSuccess: invalidate,
  });

  return { addItem, removeItem, moveItem };
}
