import { Heart } from 'lucide-react';
import StarRating from './StarRating';
import { useLikeState } from '../hooks/useLike';

type DiaryEntryCardData = {
  id: string;
  rating?: number | null;
  reviewText?: string | null;
  loggedDate: string;
  rewatch?: boolean | null;
  containsSpoilers?: boolean | null;
};

export default function DiaryEntryCard({ entry }: { entry: DiaryEntryCardData }) {
  const { count, isLiked, toggle, isPending } = useLikeState(entry.id);

  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">{entry.loggedDate}</span>
        {entry.rewatch && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Rewatch
          </span>
        )}
      </div>
      {entry.rating != null && (
        <div className="mt-1">
          <StarRating value={entry.rating} onChange={() => {}} disabled />
        </div>
      )}
      {entry.reviewText && (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          {entry.containsSpoilers && <span className="italic text-slate-400">Contains spoilers — </span>}
          {entry.reviewText}
        </p>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        className={`mt-2 flex items-center gap-1 text-xs transition disabled:opacity-50 ${
          isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
        }`}
      >
        <Heart className="h-3.5 w-3.5" fill={isLiked ? 'currentColor' : 'none'} />
        {count > 0 && count}
      </button>
    </div>
  );
}
