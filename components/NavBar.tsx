import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Rows3 } from 'lucide-react';
import { ALL_MEDIA_TYPES, MEDIA_TYPE_LABELS, MEDIA_TYPE_SLUGS } from '@/lib/types';
import type { Profile } from '@/lib/generated/prisma';

const NAV_MEDIA_TYPES = ALL_MEDIA_TYPES.filter((type) => type !== 'MANGA');

export default function NavBar({ profile }: { profile: Profile }) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
          <Rows3 className="h-5 w-5 text-indigo-600" />
          Stacks
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1 overflow-x-auto">
          {NAV_MEDIA_TYPES.map((mediaType) => (
            <Link
              key={mediaType}
              href={`/discover/${MEDIA_TYPE_SLUGS[mediaType]}`}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {MEDIA_TYPE_LABELS[mediaType]}
            </Link>
          ))}
          <Link
            href="/feed"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Feed
          </Link>
          <Link
            href={`/u/${profile.username}/lists`}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Lists
          </Link>
          <Link
            href="/import"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Import
          </Link>
          <Link
            href="/settings"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`/u/${profile.username}`}
            className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200"
          >
            @{profile.username}
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
