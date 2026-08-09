import { useAuthUser } from '../hooks/useAuthUser';
import { useFollowState } from '../hooks/useFollow';

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  const { userId } = useAuthUser();
  const { isFollowing, follow, unfollow, isPending } = useFollowState(targetUserId);

  if (!userId || userId === targetUserId) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => (isFollowing ? unfollow() : follow())}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
        isFollowing
          ? 'border border-slate-300 text-slate-700 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-200'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
