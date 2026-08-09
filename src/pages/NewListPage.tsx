import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateList } from '../hooks/useMediaLists';

const newListSchema = z.object({
  title: z.string().min(1, 'Required').max(100),
  description: z.string().max(500).optional(),
  isRanked: z.boolean().optional(),
});

type NewListForm = z.infer<typeof newListSchema>;

export default function NewListPage() {
  const navigate = useNavigate();
  const createList = useCreateList();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewListForm>({ resolver: zodResolver(newListSchema), defaultValues: { isRanked: false } });

  const onSubmit = (values: NewListForm) => {
    createList.mutate(values, {
      onSuccess: (list) => navigate(`/lists/${list.id}`),
    });
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">New list</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </label>
          <input
            id="title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            {...register('title')}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            {...register('description')}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" {...register('isRanked')} /> Ranked list (ordered, e.g. a top 10)
        </label>
        {createList.isError && <p className="text-sm text-red-600">Something went wrong. Try again.</p>}
        <button
          type="submit"
          disabled={createList.isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {createList.isPending ? 'Creating…' : 'Create list'}
        </button>
      </form>
    </div>
  );
}
