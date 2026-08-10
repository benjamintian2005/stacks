'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createList } from '@/lib/actions/lists';

const schema = z.object({
  title: z.string().min(1, 'Required').max(100),
  description: z.string().max(500).optional(),
  isRanked: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewListForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { isRanked: false } });

  const onSubmit = async (values: FormValues) => {
    const list = await createList(values);
    router.push(`/lists/${list.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Title
        </label>
        <input
          id="title"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          {...register('title')}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          {...register('description')}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input type="checkbox" {...register('isRanked')} /> Ranked list (ordered, e.g. a top 10)
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating…' : 'Create list'}
      </button>
    </form>
  );
}
