import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { searchMedia } from '../functions/search-media/resource';
import { addOrGetMediaItem } from '../functions/add-or-get-media-item/resource';
import { importProfile } from '../functions/import-profile/resource';

const schema = a.schema({
  MediaType: a.enum(['MOVIE', 'TV', 'BOOK', 'ALBUM', 'ANIME', 'MANGA', 'GAME']),
  ExternalSource: a.enum(['TMDB', 'GOOGLEBOOKS', 'MUSICBRAINZ', 'JIKAN', 'RAWG', 'MANUAL']),
  LibraryStatus: a.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED']),
  ActivityEventType: a.enum([
    'RATED',
    'LOGGED_DIARY',
    'STARTED',
    'COMPLETED',
    'CREATED_LIST',
    'FOLLOWED_USER',
    'FAVORITED',
  ]),
  ImportSourcePlatform: a.enum(['LETTERBOXD', 'GOODREADS', 'RATEYOURMUSIC']),
  ImportJobStatus: a.enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED']),

  UserProfile: a
    .model({
      username: a.string().required(),
      displayName: a.string(),
      bio: a.string(),
      avatarUrl: a.string(),
      bannerUrl: a.string(),
      favoriteMediaItemIds: a.string().array(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('username').queryField('listUserProfileByUsername')]),

  MediaItem: a
    .model({
      mediaType: a.ref('MediaType').required(),
      title: a.string().required(),
      alternateTitles: a.string().array(),
      releaseYear: a.integer(),
      coverImageUrl: a.string(),
      description: a.string(),
      genres: a.string().array(),
      creators: a.string().array(),
      externalSource: a.ref('ExternalSource').required(),
      externalId: a.string().required(),
      metadata: a.json(),
    })
    .authorization((allow) => [allow.authenticated().to(['read', 'create'])])
    .secondaryIndexes((index) => [
      index('externalSource').sortKeys(['externalId']).queryField('listMediaItemByExternalSourceAndExternalId'),
    ]),

  LibraryEntry: a
    .model({
      mediaItemId: a.id().required(),
      mediaItem: a.belongsTo('MediaItem', 'mediaItemId'),
      status: a.ref('LibraryStatus').required(),
      rating: a.float(),
      isFavorite: a.boolean().default(false),
      startedAt: a.date(),
      completedAt: a.date(),
      progress: a.string(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('mediaItemId').queryField('listLibraryEntryByMediaItemId')]),

  DiaryEntry: a
    .model({
      mediaItemId: a.id().required(),
      mediaItem: a.belongsTo('MediaItem', 'mediaItemId'),
      libraryEntryId: a.id(),
      rating: a.float(),
      reviewText: a.string(),
      loggedDate: a.date().required(),
      containsSpoilers: a.boolean().default(false),
      rewatch: a.boolean().default(false),
      likeCount: a.integer().default(0),
      commentCount: a.integer().default(0),
      likes: a.hasMany('Like', 'diaryEntryId'),
      comments: a.hasMany('Comment', 'diaryEntryId'),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('mediaItemId').queryField('listDiaryEntryByMediaItemId')]),

  MediaList: a
    .model({
      // Mirrors the owner-auth identity as a plain queryable field, since Amplify Data's
      // implicit `owner` field can't be targeted by a secondary index directly.
      creatorId: a.id().required(),
      title: a.string().required(),
      description: a.string(),
      isRanked: a.boolean().default(false),
      coverImageUrl: a.string(),
      items: a.hasMany('MediaListItem', 'mediaListId'),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('creatorId').queryField('listMediaListByCreatorId')]),

  MediaListItem: a
    .model({
      mediaListId: a.id().required(),
      mediaList: a.belongsTo('MediaList', 'mediaListId'),
      mediaItemId: a.id().required(),
      mediaItem: a.belongsTo('MediaItem', 'mediaItemId'),
      position: a.integer().required(),
      note: a.string(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('mediaListId').queryField('listMediaListItemByMediaListId')]),

  Follow: a
    .model({
      // id is deterministic (`${followerId}::${followingUserId}`) so toggling follow state is a get(), not a query.
      followerId: a.id().required(),
      followingUserId: a.id().required(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [
      index('followerId').queryField('listFollowByFollowerId'),
      index('followingUserId').queryField('listFollowByFollowingUserId'),
    ]),

  ActivityEvent: a
    .model({
      // Mirrors the owner-auth identity as a plain queryable field, same reasoning as MediaList.creatorId.
      actorId: a.id().required(),
      eventType: a.ref('ActivityEventType').required(),
      mediaItemId: a.id(),
      diaryEntryId: a.id(),
      mediaListId: a.id(),
      targetUserId: a.id(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('actorId').queryField('listActivityEventByActorId')]),

  Like: a
    .model({
      diaryEntryId: a.id().required(),
      diaryEntry: a.belongsTo('DiaryEntry', 'diaryEntryId'),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('diaryEntryId').queryField('listLikeByDiaryEntryId')]),

  Comment: a
    .model({
      diaryEntryId: a.id().required(),
      diaryEntry: a.belongsTo('DiaryEntry', 'diaryEntryId'),
      text: a.string().required(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(['read'])])
    .secondaryIndexes((index) => [index('diaryEntryId').queryField('listCommentByDiaryEntryId')]),

  // The frontend owns this row directly (create on submit, update once startImport resolves) so the
  // importProfile Function never needs data-model resource access or has to fabricate an owner value.
  ImportJob: a
    .model({
      sourcePlatform: a.ref('ImportSourcePlatform').required(),
      sourceUrl: a.string().required(),
      status: a.ref('ImportJobStatus').required(),
      rawResultsJson: a.json(),
      errorMessage: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  ImportScrapedItem: a.customType({
    title: a.string().required(),
    rating: a.float(),
    platform: a.ref('ImportSourcePlatform').required(),
  }),

  MediaSearchResult: a.customType({
    mediaType: a.ref('MediaType').required(),
    externalSource: a.ref('ExternalSource').required(),
    externalId: a.string().required(),
    title: a.string().required(),
    releaseYear: a.integer(),
    coverImageUrl: a.string(),
    creators: a.string().array(),
    description: a.string(),
  }),

  searchMedia: a
    .query()
    .arguments({ mediaType: a.ref('MediaType').required(), query: a.string().required() })
    .returns(a.ref('MediaSearchResult').array())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(searchMedia)),

  addOrGetMediaItem: a
    .mutation()
    .arguments({
      mediaType: a.ref('MediaType').required(),
      externalSource: a.ref('ExternalSource').required(),
      externalId: a.string().required(),
      title: a.string().required(),
      releaseYear: a.integer(),
      coverImageUrl: a.string(),
      description: a.string(),
      genres: a.string().array(),
      creators: a.string().array(),
      metadata: a.json(),
    })
    .returns(a.ref('MediaItem'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(addOrGetMediaItem)),

  startImport: a
    .query()
    .arguments({ sourcePlatform: a.ref('ImportSourcePlatform').required(), sourceUrl: a.string().required() })
    .returns(a.ref('ImportScrapedItem').array())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(importProfile)),
}).authorization((allow) => [allow.resource(addOrGetMediaItem).to(['query', 'mutate'])]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
