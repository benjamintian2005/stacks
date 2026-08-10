import ImportWizardForm from '@/components/ImportWizardForm';

export default function ImportWizardPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Import your ratings</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Paste a public profile URL (or just a username). Letterboxd import uses its public RSS feed and is
        reliable. Goodreads and RateYourMusic scrape public pages since neither offers a ratings API — treat
        those as experimental and best-effort.
      </p>
      <ImportWizardForm />
    </div>
  );
}
