import { useMutation } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import type { MediaSearchResult } from '../types/media';

export function useAddOrGetMediaItem() {
  return useMutation({
    mutationFn: async (result: MediaSearchResult) => {
      const { data, errors } = await client.mutations.addOrGetMediaItem({
        mediaType: result.mediaType,
        externalSource: result.externalSource,
        externalId: result.externalId,
        title: result.title,
        releaseYear: result.releaseYear,
        coverImageUrl: result.coverImageUrl,
        description: result.description,
        creators: result.creators,
      });
      if (errors?.length || !data) {
        throw new Error(errors?.map((e) => e.message).join('; ') ?? 'Failed to open this title');
      }
      return data;
    },
  });
}
