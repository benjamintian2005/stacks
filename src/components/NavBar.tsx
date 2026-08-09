import { Link, NavLink } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { LogOut, Rows3 } from 'lucide-react';
import { useAuthUser } from '../hooks/useAuthUser';
import { MEDIA_TYPE_LABELS, MEDIA_TYPE_SLUGS, type MediaType } from '../types/media';

const NAV_MEDIA_TYPES: MediaType[] = ['MOVIE', 'TV', 'BOOK', 'ALBUM', 'ANIME', 'GAME'];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

export default function NavBar() {
  const { profile } = useAuthUser();

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
          <Rows3 className="h-5 w-5 text-indigo-600" />
          Stacks
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1 overflow-x-auto">
          {NAV_MEDIA_TYPES.map((mediaType) => (
            <NavLink key={mediaType} to={`/discover/${MEDIA_TYPE_SLUGS[mediaType]}`} className={linkClasses}>
              {MEDIA_TYPE_LABELS[mediaType]}
            </NavLink>
          ))}
          <NavLink to="/feed" className={linkClasses}>
            Feed
          </NavLink>
          {profile && (
            <NavLink to={`/u/${profile.username}/lists`} className={linkClasses}>
              Lists
            </NavLink>
          )}
          <NavLink to="/import" className={linkClasses}>
            Import
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {profile && (
            <Link
              to={`/u/${profile.username}`}
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200"
            >
              @{profile.username}
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
