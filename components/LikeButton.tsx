'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/lib/actions/likes';

export default function LikeButton({
  experienceId,
  initialCount,
  initialLiked,
}: {
  experienceId: string;
  initialCount: number;
  initialLiked: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));
    startTransition(async () => {
      await toggleLike(experienceId);
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={toggle}
      className={`mt-2 flex items-center gap-1 text-xs transition disabled:opacity-50 ${
        liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
      }`}
    >
      <Heart className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} />
      {count > 0 && count}
    </button>
  );
}
