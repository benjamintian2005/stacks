'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from '@/lib/actions/profile';

const schema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(300).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsForm({ initialDisplayName, initialBio }: { initialDisplayName: string; initialBio: string }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: initialDisplayName, bio: initialBio },
  });

  const onSubmit = async (values: FormValues) => {
    setSaved(false);
    const result = await updateProfile(values);
    if (result?.error) {
      setError('root', { message: result.error });
      return;
    }
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Display name
        </label>
        <input
          id="displayName"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          {...register('displayName')}
        />
      </div>
      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          {...register('bio')}
        />
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
      </div>
      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      {saved && <p className="text-sm text-emerald-600">Saved.</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
