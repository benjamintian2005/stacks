'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addComment } from '@/lib/actions/comments';

export default function CommentForm({ experienceId }: { experienceId: string }) {
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    if (!text.trim()) return;
    startTransition(async () => {
      await addComment({ experienceId, text });
      setText('');
      router.refresh();
    });
  };

  return (
    <div className="mt-2 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder="Add a comment…"
        className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      <button
        type="button"
        disabled={isPending || !text.trim()}
        onClick={submit}
        className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Post
      </button>
    </div>
  );
}
