import { useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { AuthContext, type AuthStatus } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { userId: id } = await getCurrentUser();
        setUserId(id);
        setStatus('authenticated');
      } catch {
        setUserId(null);
        setStatus('unauthenticated');
      }
    };

    checkUser();

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || payload.event === 'signedOut') {
        checkUser();
      }
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ status, userId }}>{children}</AuthContext.Provider>;
}
