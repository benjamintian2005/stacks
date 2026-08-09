import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { searchMedia } from './functions/search-media/resource';
import { addOrGetMediaItem } from './functions/add-or-get-media-item/resource';
import { importProfile } from './functions/import-profile/resource';

defineBackend({
  auth,
  data,
  storage,
  searchMedia,
  addOrGetMediaItem,
  importProfile,
});
