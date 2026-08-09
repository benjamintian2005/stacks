import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from './useAuthUser';

const followId = (followerId: string, followingUserId: string) => `${followerId}::${followingUserId}`;

/** Everyone a given user follows — used for the activity feed fan-out and "following" lists. */
export function useFollowingIds(followerId: string | undefined) {
  return useQuery({
    queryKey: ['followingIds', followerId],
    queryFn: async () => {
      if (!followerId) return [];
      const { data } = await client.models.Follow.listFollowByFollowerId({ followerId });
      return data.map((f) => f.followingUserId);
    },
    enabled: !!followerId,
  });
}

export function useFollowState(targetUserId: string | undefined) {
  const { userId } = useAuthUser();
  const queryClient = useQueryClient();
  const id = userId && targetUserId ? followId(userId, targetUserId) : undefined;

  const followQuery = useQuery({
    queryKey: ['follow', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await client.models.Follow.get({ id });
      return data;
    },
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['follow', id] });
    queryClient.invalidateQueries({ queryKey: ['followingIds', userId] });
  };

  const follow = useMutation({
    mutationFn: async () => {
      if (!id || !userId || !targetUserId) throw new Error('Must be signed in to follow');
      const { data } = await client.models.Follow.create({ id, followerId: userId, followingUserId: targetUserId });
      await client.models.ActivityEvent.create({ actorId: userId, eventType: 'FOLLOWED_USER', targetUserId });
      return data;
    },
    onSuccess: invalidate,
  });

  const unfollow = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Not following');
      await client.models.Follow.delete({ id });
    },
    onSuccess: invalidate,
  });

  return {
    isFollowing: !!followQuery.data,
    isLoading: followQuery.isLoading,
    follow: follow.mutate,
    unfollow: unfollow.mutate,
    isPending: follow.isPending || unfollow.isPending,
  };
}
