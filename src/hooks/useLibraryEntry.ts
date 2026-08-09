import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from './useAuthUser';
import type { LibraryStatus } from '../types/media';

/** One LibraryEntry per (user, mediaItem) — id is deterministic so lookups are a get(), not a query. */
const libraryEntryId = (userId: string, mediaItemId: string) => `${userId}::${mediaItemId}`;

type UpsertInput = {
  status: LibraryStatus;
  rating?: number | null;
  isFavorite?: boolean;
};

export function useLibraryEntry(mediaItemId: string | undefined) {
  const { userId } = useAuthUser();
  const queryClient = useQueryClient();
  const id = userId && mediaItemId ? libraryEntryId(userId, mediaItemId) : undefined;

  const entryQuery = useQuery({
    queryKey: ['libraryEntry', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await client.models.LibraryEntry.get({ id });
      return data;
    },
    enabled: !!id,
  });

  const upsert = useMutation({
    mutationFn: async (input: UpsertInput) => {
      if (!id || !mediaItemId) {
        throw new Error('Cannot update library entry without a signed-in user and media item');
      }
      if (entryQuery.data) {
        const { data } = await client.models.LibraryEntry.update({ id, ...input });
        return data;
      }
      const { data } = await client.models.LibraryEntry.create({ id, mediaItemId, ...input });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['libraryEntry', id], data);
    },
  });

  return {
    entry: entryQuery.data ?? null,
    isLoading: entryQuery.isLoading,
    upsert: upsert.mutate,
    isUpserting: upsert.isPending,
  };
}
