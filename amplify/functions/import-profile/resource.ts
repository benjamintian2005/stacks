import { defineFunction } from '@aws-amplify/backend';

export const importProfile = defineFunction({
  name: 'import-profile',
  entry: './handler.ts',
  timeoutSeconds: 90,
});
