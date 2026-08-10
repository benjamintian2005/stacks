import Link from 'next/link';
import StarRating from './StarRating';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';

type DiaryEntryCardData = {
  id: string;
  mediaItemId: string;
  rating?: number | null;
  reviewText?: string | null;
  loggedDate: Date;
  rewatch?: boolean | null;
  containsSpoilers?: boolean | null;
  user: { username: string };
  _count: { likes: number };
  likes: { userId: string }[];
  comments?: { id: string; text: string; user: { username: string } }[];
  mediaItem?: { title: string };
};

export default function DiaryEntryCard({ entry }: { entry: DiaryEntryCardData }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/u/${entry.user.username}`}
            className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
          >
            @{entry.user.username}
          </Link>
          <span className="text-slate-500 dark:text-slate-400">{entry.loggedDate.toISOString().slice(0, 10)}</span>
        </div>
        {entry.rewatch && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Rewatch
          </span>
        )}
      </div>
      {entry.mediaItem && (
        <Link
          href={`/media/${entry.mediaItemId}`}
          className="mt-1 block text-sm font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
        >
          {entry.mediaItem.title}
        </Link>
      )}
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
      <LikeButton
        diaryEntryId={entry.id}
        mediaItemId={entry.mediaItemId}
        initialCount={entry._count.likes}
        initialLiked={entry.likes.length > 0}
      />

      {entry.comments && (
        <div className="mt-2 space-y-1 border-t border-slate-100 pt-2 dark:border-slate-800">
          {entry.comments.map((comment) => (
            <p key={comment.id} className="text-xs text-slate-600 dark:text-slate-400">
              <Link href={`/u/${comment.user.username}`} className="font-medium text-slate-900 dark:text-white">
                @{comment.user.username}
              </Link>{' '}
              {comment.text}
            </p>
          ))}
          <CommentForm diaryEntryId={entry.id} mediaItemId={entry.mediaItemId} />
        </div>
      )}
    </div>
  );
}
