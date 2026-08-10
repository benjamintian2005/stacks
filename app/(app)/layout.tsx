import type { ReactNode } from 'react';
import { requireProfile } from '@/lib/auth';
import NavBar from '@/components/NavBar';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <NavBar profile={profile} />
      <main>{children}</main>
    </div>
  );
}
