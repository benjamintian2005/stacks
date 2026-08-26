import LogExperienceForm from '@/components/LogExperienceForm';

export default function LogPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Log an experience</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">What did you do?</p>
      <LogExperienceForm />
    </div>
  );
}
