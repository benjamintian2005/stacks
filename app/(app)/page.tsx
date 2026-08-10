import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth';
import { ALL_MEDIA_TYPES, MEDIA_TYPE_LABELS, MEDIA_TYPE_SLUGS } from '@/lib/types';

export default async function HomePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Search a catalog, log what you&apos;ve consumed, and keep track of ratings across everything.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {ALL_MEDIA_TYPES.map((mediaType) => (
          <Link
            key={mediaType}
            href={`/discover/${MEDIA_TYPE_SLUGS[mediaType]}`}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Discover {MEDIA_TYPE_LABELS[mediaType]}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search, rate, and add to your library.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
