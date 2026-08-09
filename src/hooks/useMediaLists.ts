import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from './useAuthUser';

type CreateListInput = {
  title: string;
  description?: string;
  isRanked?: boolean;
};

export function useListsByCreator(creatorId: string | undefined) {
  return useQuery({
    queryKey: ['mediaLists', creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      const { data } = await client.models.MediaList.listMediaListByCreatorId({ creatorId });
      return data;
    },
    enabled: !!creatorId,
  });
}

export function useCreateList() {
  const { userId } = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateListInput) => {
      if (!userId) throw new Error('Must be signed in to create a list');
      const { data, errors } = await client.models.MediaList.create({ creatorId: userId, ...input });
      if (errors?.length || !data) {
        throw new Error(errors?.map((e) => e.message).join('; ') ?? 'Failed to create list');
      }
      await client.models.ActivityEvent.create({ actorId: userId, eventType: 'CREATED_LIST', mediaListId: data.id });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaLists', userId] });
    },
  });
}
