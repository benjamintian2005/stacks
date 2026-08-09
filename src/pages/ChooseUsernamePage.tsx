import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import { useAuthUser } from '../hooks/useAuthUser';

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
  displayName: z.string().max(50).optional(),
});

type UsernameForm = z.infer<typeof usernameSchema>;

export default function ChooseUsernamePage() {
  const { userId, refetchProfile } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UsernameForm>({ resolver: zodResolver(usernameSchema) });

  const onSubmit = async (values: UsernameForm) => {
    if (!userId) return;

    const { data: existing } = await client.models.UserProfile.listUserProfileByUsername({
      username: values.username,
    });

    if (existing.length > 0) {
      setError('username', { message: 'That username is already taken' });
      return;
    }

    const { data: created, errors: createErrors } = await client.models.UserProfile.create({
      id: userId,
      username: values.username,
      displayName: values.displayName || values.username,
    });

    if (createErrors?.length || !created) {
      setError('root', { message: 'Something went wrong creating your profile. Try again.' });
      return;
    }

    queryClient.setQueryData(['userProfile', userId], created);
    await refetchProfile();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Choose a username</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          This is how other people on Stacks will find and mention you.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              id="username"
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              {...register('username')}
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>
          <div>
            <label
              htmlFor="displayName"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Display name (optional)
            </label>
            <input
              id="displayName"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              {...register('displayName')}
            />
          </div>
          {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
