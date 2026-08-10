'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { logDiaryEntry } from '@/lib/actions/diary';
import StarRating from './StarRating';

const logSchema = z.object({
  loggedDate: z.string().min(1, 'Required'),
  rating: z.number().min(0).max(10).nullable(),
  reviewText: z.string().max(2000).optional(),
  containsSpoilers: z.boolean().optional(),
  rewatch: z.boolean().optional(),
});

type LogFormValues = z.infer<typeof logSchema>;

const today = () => new Date().toISOString().slice(0, 10);

export default function LogEntryForm({ mediaItemId }: { mediaItemId: string }) {
  const router = useRouter();
  const { register, handleSubmit, control, reset, formState } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { loggedDate: today(), rating: null, reviewText: '', containsSpoilers: false, rewatch: false },
  });

  const onSubmit = async (values: LogFormValues) => {
    await logDiaryEntry({ mediaItemId, ...values });
    reset({ loggedDate: today(), rating: null, reviewText: '', containsSpoilers: false, rewatch: false });
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800"
    >
      <h3 className="font-semibold text-slate-900 dark:text-white">Log this</h3>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Rating</p>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div>
        <label htmlFor="loggedDate" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Date
        </label>
        <input
          id="loggedDate"
          type="date"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          {...register('loggedDate')}
        />
      </div>

      <div>
        <label htmlFor="reviewText" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Review (optional)
        </label>
        <textarea
          id="reviewText"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          {...register('reviewText')}
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" {...register('rewatch')} /> Rewatch
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" {...register('containsSpoilers')} /> Contains spoilers
        </label>
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {formState.isSubmitting ? 'Saving…' : 'Save log entry'}
      </button>
    </form>
  );
}
