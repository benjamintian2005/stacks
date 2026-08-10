# Stacks

Stacks is a consolidated media-tracking webapp — one place to search, rate, log, and list everything you
watch, read, play, and listen to. Think Letterboxd (movies/TV) + Goodreads (books) + RateYourMusic (music)
+ MyAnimeList (anime/manga) + a games tracker, combined.

Live at **https://stacks-mu-seven.vercel.app**.

## Technology stack

- **Frontend/Backend**: Next.js (App Router) + TypeScript (strict) + Tailwind CSS 4
- **Auth**: Clerk
- **Database**: Prisma + Neon Postgres (via the `@prisma/adapter-neon` driver adapter)
- **Hosting**: Vercel — Neon Postgres and Clerk both provisioned through the Vercel Marketplace

Mutations go through Server Actions (`lib/actions/*.ts`); data reads happen directly in Server Components.
There's no separate REST/GraphQL API layer.

## Getting started

```bash
npm install

vercel link                     # link this directory to your Vercel project
vercel integration add neon     # provisions Postgres, injects DATABASE_URL etc.
vercel integration add clerk    # provisions auth, injects Clerk keys
vercel env pull .env.local

# TMDB and RAWG require your own free API keys (Google Books/MusicBrainz/Jikan work keyless):
#   https://www.themoviedb.org/settings/api
#   https://rawg.io/apidocs
# add TMDB_API_KEY / RAWG_API_KEY to .env.local and to the Vercel project's env vars

npx prisma migrate dev --name init   # first-time schema setup against Neon
npm run dev
```

`prisma.config.ts` points Migrate at `DATABASE_URL_UNPOOLED` (Neon's direct, non-pooled connection —
required for migrations); the running app itself uses the pooled `DATABASE_URL` via the Neon driver adapter
in `lib/db.ts`.

## Scope

All six phases of the original build-out are implemented:

- **Auth & profiles**: Clerk sign-in/sign-up, first-login username picker (`app/welcome`), route protection
  via `proxy.ts` (Next 16's renamed middleware).
- **Catalog search**, live for all five categories — Movies/TV (TMDB), Books (Google Books), Music
  (MusicBrainz + Cover Art Archive), Anime/Manga (Jikan), Games (RAWG). See `lib/search/`.
- **Library + diary/reviews**: status/half-star rating per title, append-only log entries (rating, review
  text, date, spoiler/rewatch flags) so rewatches are representable.
- **Ranked lists**: create, add items via the same catalog search, reorder, remove.
- **Social**: follow/unfollow, an activity feed (`/feed`) from diary logs/new lists/new follows, and likes
  on diary entries.
- **Import**: `/import` accepts a Letterboxd (public RSS — reliable), Goodreads, or RateYourMusic
  (HTML-scraped — experimental, ported from the `MediaParser` reference project and will break if those
  sites change their markup) profile URL. Nothing is added automatically — `/import/[jobId]` is a manual
  match-and-confirm review step. See `lib/import/`.

Known gaps, by design (not oversights):
- No logged-out browsing — every route except `/sign-in`, `/sign-up`, and `/welcome` requires a session.
- A user's full per-category library/diary browsing views and `/settings` aren't built yet.
- No avatar/banner upload UI (would use Vercel Blob).
- No comments on diary entries (likes only) — the `Comment` model exists in the schema for a future pass.
- Clerk is still running in development mode (test API keys) — a production Clerk instance needs a
  verified custom domain.

## Testing

```bash
npm run lint
npm run build   # tsc + next build
npm test        # vitest — normalizer/scraper unit tests + component smoke tests
```
