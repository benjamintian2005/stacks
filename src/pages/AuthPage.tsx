import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator, ThemeProvider, type Theme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from '../lib/authContext';

const theme: Theme = {
  name: 'stacks-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#eef2ff' },
          20: { value: '#e0e7ff' },
          40: { value: '#818cf8' },
          60: { value: '#6366f1' },
          80: { value: '#4f46e5' },
          90: { value: '#4338ca' },
          100: { value: '#3730a3' },
        },
      },
    },
    radii: {
      small: { value: '0.5rem' },
      medium: { value: '0.75rem' },
      large: { value: '1rem' },
    },
  },
};

export default function AuthPage() {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Stacks
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Track everything you watch, read, play &amp; listen to.
        </p>
        <ThemeProvider theme={theme}>
          <Authenticator />
        </ThemeProvider>
      </div>
    </div>
  );
}
