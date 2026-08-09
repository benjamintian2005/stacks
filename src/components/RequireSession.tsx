import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';

/** Guards routes that only need a signed-in Cognito session, not a UserProfile (e.g. /welcome). */
export default function RequireSession({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Loading…
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
