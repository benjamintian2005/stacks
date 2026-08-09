import { defineFunction } from '@aws-amplify/backend';

export const addOrGetMediaItem = defineFunction({
  name: 'add-or-get-media-item',
  entry: './handler.ts',
  timeoutSeconds: 10,
});
