import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../lib/authContext';
import { client } from '../lib/amplifyClient';

/**
 * UserProfile.id is deliberately set to the Cognito sub at creation time,
 * so "my profile" is a direct get() rather than an owner-scoped query.
 */
export function useAuthUser() {
  const { status, userId } = useAuth();

  const profileQuery = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await client.models.UserProfile.get({ id: userId });
      return data;
    },
    enabled: status === 'authenticated' && !!userId,
  });

  return {
    authStatus: status,
    userId,
    profile: profileQuery.data ?? null,
    isProfileLoading: status === 'authenticated' && profileQuery.isLoading,
    refetchProfile: profileQuery.refetch,
  };
}
