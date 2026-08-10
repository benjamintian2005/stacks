'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { startImport } from '@/lib/actions/import';

const schema = z.object({
  sourcePlatform: z.enum(['LETTERBOXD', 'GOODREADS', 'RATEYOURMUSIC']),
  sourceUrl: z.string().min(1, 'Required'),
});

type FormValues = z.infer<typeof schema>;

export default function ImportWizardForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { sourcePlatform: 'LETTERBOXD' } });

  const onSubmit = async (values: FormValues) => {
    const jobId = await startImport(values.sourcePlatform, values.sourceUrl);
    router.push(`/import/${jobId}`);
  };

  return (
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
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Importing…' : 'Start import'}
      </button>
    </form>
  );
}
