import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useStartImport } from '../hooks/useImportJob';

const importSchema = z.object({
  sourcePlatform: z.enum(['LETTERBOXD', 'GOODREADS', 'RATEYOURMUSIC']),
  sourceUrl: z.string().min(1, 'Required'),
});

type ImportForm = z.infer<typeof importSchema>;

export default function ImportWizardPage() {
  const navigate = useNavigate();
  const startImport = useStartImport();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportForm>({ resolver: zodResolver(importSchema), defaultValues: { sourcePlatform: 'LETTERBOXD' } });

  const onSubmit = (values: ImportForm) => {
    startImport.mutate(values, { onSuccess: (job) => navigate(`/import/${job.id}`) });
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Import your ratings</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Paste a public profile URL (or just a username). Letterboxd import uses its public RSS feed and is
        reliable. Goodreads and RateYourMusic scrape public pages since neither offers a ratings API — treat
        those as experimental and best-effort.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="sourcePlatform"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Platform
          </label>
          <select
            id="sourcePlatform"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            {...register('sourcePlatform')}
          >
            <option value="LETTERBOXD">Letterboxd</option>
            <option value="GOODREADS">Goodreads</option>
            <option value="RATEYOURMUSIC">RateYourMusic</option>
          </select>
        </div>
        <div>
          <label htmlFor="sourceUrl" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Profile URL or username
          </label>
          <input
            id="sourceUrl"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="https://letterboxd.com/yourusername/"
            {...register('sourceUrl')}
          />
          {errors.sourceUrl && <p className="mt-1 text-sm text-red-600">{errors.sourceUrl.message}</p>}
        </div>
        {startImport.isError && (
          <p className="text-sm text-red-600">
            {startImport.error instanceof Error ? startImport.error.message : 'Import failed. Try again.'}
          </p>
        )}
        <button
          type="submit"
          disabled={startImport.isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {startImport.isPending ? 'Importing…' : 'Start import'}
        </button>
      </form>
    </div>
  );
}
