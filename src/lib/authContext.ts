import { createContext, useContext } from 'react';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  status: AuthStatus;
  userId: string | null;
};

export const AuthContext = createContext<AuthContextValue>({ status: 'loading', userId: null });

export const useAuth = () => useContext(AuthContext);
