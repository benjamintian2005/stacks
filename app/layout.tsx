import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stacks — track everything you watch, read, play & listen to',
  description: 'A consolidated media tracker for movies, TV, books, music, anime, manga, and games.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="en">
        <body className="bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
