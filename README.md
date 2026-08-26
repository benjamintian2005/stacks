# Stacks

Stacks is an experience tracker — log the things you actually go do (a hike, a concert, a trip, a meal),
attach photos, and see what your friends have been up to. Think a shared journal/feed rather than a
media catalog.

Live at **https://stacks-mu-seven.vercel.app**.

## Technology stack

- **Frontend/Backend**: Next.js (App Router) + TypeScript (strict) + Tailwind CSS 4
- **Auth**: Clerk
- **Database**: Prisma + Neon Postgres (via the `@prisma/adapter-neon` driver adapter)
- **Photo storage**: Vercel Blob (client-side direct upload via `@vercel/blob/client`)
- **Hosting**: Vercel — Neon Postgres and Clerk both provisioned through the Vercel Marketplace

Mutations go through Server Actions (`lib/actions/*.ts`); data reads happen directly in Server Components.
There's no separate REST/GraphQL API layer, except `app/api/upload/route.ts`, which issues short-lived
client-upload tokens for Vercel Blob.

## Getting started

```bash
npm install

vercel link                     # link this directory to your Vercel project
vercel integration add neon     # provisions Postgres, injects DATABASE_URL etc.
vercel integration add clerk    # provisions auth, injects Clerk keys
# Create a Blob store at https://vercel.com/dashboard/stores and connect it to this project
# (injects BLOB_READ_WRITE_TOKEN)
vercel env pull .env.local

npx prisma migrate dev --name init   # first-time schema setup against Neon
npm run dev
```

`prisma.config.ts` points Migrate at `DATABASE_URL_UNPOOLED` (Neon's direct, non-pooled connection —
required for migrations); the running app itself uses the pooled `DATABASE_URL` via the Neon driver adapter
in `lib/db.ts`.

## Scope

- **Auth & profiles**: Clerk sign-in/sign-up, first-login username picker (`app/welcome`), route protection
  via `proxy.ts` (Next 16's renamed middleware).
- **Logging experiences**: `/log` — title, description, date, optional location, and multiple photos
  uploaded directly to Vercel Blob from the browser (`components/LogExperienceForm.tsx`).
- **Personal timeline**: `/` shows your own logged experiences.
- **Social**: follow/unfollow, a feed (`/feed`) of recent experiences from people you follow, likes and
  comments on experiences.
- **Profile browsing**: `/u/[username]` shows a user's bio and their logged experiences, with a follow
  button.
- `loading.tsx` skeletons on the data-heavy routes (feed, experience detail, profile) so navigation doesn't
  show a blank page while Prisma queries resolve.

Known gaps, by design (not oversights):
- No logged-out browsing — every route except `/sign-in`, `/sign-up`, and `/welcome` requires a session.
- No avatar/banner upload UI (would reuse the same Vercel Blob upload path as experience photos).
- Clerk is still running in development mode (test API keys) — a production Clerk instance needs a
  verified custom domain.

## Testing

```bash
npm run lint
npm run build   # tsc + next build
npm test        # vitest
```
