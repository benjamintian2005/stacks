import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from './useAuthUser';

type LogInput = {
  mediaItemId: string;
  rating?: number | null;
  reviewText?: string;
  loggedDate: string;
  containsSpoilers?: boolean;
  rewatch?: boolean;
};

/** Shows every user's log entries for a media item, like a film's reviews tab. */
export function useDiaryEntries(mediaItemId: string | undefined) {
  const { userId } = useAuthUser();
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ['diaryEntries', mediaItemId],
    queryFn: async () => {
      if (!mediaItemId) return [];
      const { data } = await client.models.DiaryEntry.listDiaryEntryByMediaItemId({ mediaItemId });
      return [...data].sort((a, b) => b.loggedDate.localeCompare(a.loggedDate));
    },
    enabled: !!mediaItemId,
  });

  const logEntry = useMutation({
    mutationFn: async (input: LogInput) => {
      const { data, errors } = await client.models.DiaryEntry.create(input);
      if (errors?.length || !data) {
        throw new Error(errors?.map((e) => e.message).join('; ') ?? 'Failed to save log entry');
      }
      if (userId) {
        await client.models.ActivityEvent.create({
          actorId: userId,
          eventType: 'LOGGED_DIARY',
          mediaItemId: input.mediaItemId,
          diaryEntryId: data.id,
        });
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryEntries', mediaItemId] });
    },
  });

  return {
    entries: entriesQuery.data ?? [],
    isLoading: entriesQuery.isLoading,
    logEntry: logEntry.mutate,
    isLogging: logEntry.isPending,
  };
}
