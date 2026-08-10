'use client';

import { useState, useTransition } from 'react';
import { followUser, unfollowUser } from '@/lib/actions/follow';

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
}: {
  targetUserId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowingState, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      if (isFollowingState) {
        await unfollowUser(targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(targetUserId);
        setIsFollowing(true);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={toggle}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
        isFollowingState
          ? 'border border-slate-300 text-slate-700 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-200'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
    >
      {isFollowingState ? 'Following' : 'Follow'}
    </button>
  );
}
