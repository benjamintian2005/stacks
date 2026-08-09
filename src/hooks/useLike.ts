import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from './useAuthUser';

export function useLikeState(diaryEntryId: string) {
  const { userId } = useAuthUser();
  const queryClient = useQueryClient();
  const id = userId ? `${userId}::${diaryEntryId}` : undefined;

  const likesQuery = useQuery({
    queryKey: ['likes', diaryEntryId],
    queryFn: async () => {
      const { data } = await client.models.Like.listLikeByDiaryEntryId({ diaryEntryId });
      return data;
    },
  });

  const myLikeQuery = useQuery({
    queryKey: ['like', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await client.models.Like.get({ id });
      return data;
    },
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['likes', diaryEntryId] });
    queryClient.invalidateQueries({ queryKey: ['like', id] });
  };

  const like = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Must be signed in to like');
      await client.models.Like.create({ id, diaryEntryId });
    },
    onSuccess: invalidate,
  });

  const unlike = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await client.models.Like.delete({ id });
    },
    onSuccess: invalidate,
  });

  return {
    count: likesQuery.data?.length ?? 0,
    isLiked: !!myLikeQuery.data,
    toggle: () => (myLikeQuery.data ? unlike.mutate() : like.mutate()),
    isPending: like.isPending || unlike.isPending,
  };
}
