import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/add-or-get-media-item';
import type { Schema } from '../../data/resource';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>({ authMode: 'iam' });

export const handler: Schema['addOrGetMediaItem']['functionHandler'] = async (event) => {
  const { externalSource, externalId } = event.arguments;

  const existing = await client.models.MediaItem.listMediaItemByExternalSourceAndExternalId({
    externalSource,
    externalId: { eq: externalId },
  });

  if (existing.data.length > 0) {
    return existing.data[0];
  }

  const { data: created, errors } = await client.models.MediaItem.create(event.arguments);

  if (errors || !created) {
    throw new Error(errors?.map((e) => e.message).join('; ') ?? 'Failed to create MediaItem');
  }

  return created;
};
