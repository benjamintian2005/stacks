import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';

export function useUserProfileByUsername(username: string | undefined) {
  return useQuery({
    queryKey: ['userProfileByUsername', username],
    queryFn: async () => {
      if (!username) return null;
      const { data } = await client.models.UserProfile.listUserProfileByUsername({ username });
      return data[0] ?? null;
    },
    enabled: !!username,
  });
}
