import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { authStatus, profile, isProfileLoading } = useAuthUser();

  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Loading…
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Loading…
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
