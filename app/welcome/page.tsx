import { redirect } from 'next/navigation';
import { requireUserId, getCurrentProfile } from '@/lib/auth';
import WelcomeForm from '@/components/WelcomeForm';

export default async function WelcomePage() {
  await requireUserId();
  const profile = await getCurrentProfile();
  if (profile) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Choose a username</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          This is how other people on Stacks will find and mention you.
        </p>
        <WelcomeForm />
      </div>
    </div>
  );
}
