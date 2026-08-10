import { requireProfile } from '@/lib/auth';
import SettingsForm from '@/components/SettingsForm';

export default async function SettingsPage() {
  const profile = await requireProfile();

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">@{profile.username}</p>
      <SettingsForm initialDisplayName={profile.displayName ?? ''} initialBio={profile.bio ?? ''} />
    </div>
  );
}
