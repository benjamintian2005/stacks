'use client';

import { useTransition } from 'react';
import { deleteExperience } from '@/lib/actions/experiences';

export default function DeleteExperienceButton({ experienceId }: { experienceId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm('Delete this experience?')) return;
        startTransition(async () => {
          await deleteExperience(experienceId);
        });
      }}
      className="mt-2 text-xs text-slate-400 transition hover:text-red-600 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
