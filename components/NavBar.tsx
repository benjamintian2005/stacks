import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Compass, Plus } from 'lucide-react';
import type { Profile } from '@/lib/generated/prisma';

export default function NavBar({ profile }: { profile: Profile }) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
          <Compass className="h-5 w-5 text-indigo-600" />
          Stacks
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          <Link
            href="/feed"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Feed
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
            href="/log"
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Log
          </Link>
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
