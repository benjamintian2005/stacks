import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import type { MediaType } from '../types/media';

export function useSearchMedia(mediaType: MediaType, query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['searchMedia', mediaType, trimmed],
    queryFn: async () => {
      const { data, errors } = await client.queries.searchMedia({ mediaType, query: trimmed });
      if (errors?.length) {
        throw new Error(errors.map((e) => e.message).join('; '));
      }
      return data ?? [];
    },
    enabled: trimmed.length > 1,
  });
}
