import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';

type ExperienceCardData = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  experiencedAt: Date;
  user: { username: string };
  photos: { id: string; url: string }[];
  _count: { likes: number };
  likes: { userId: string }[];
  comments?: { id: string; text: string; user: { username: string } }[];
};

export default function ExperienceCard({ experience }: { experience: ExperienceCardData }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/u/${experience.user.username}`}
            className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
          >
            @{experience.user.username}
          </Link>
          <span className="text-slate-500 dark:text-slate-400">
            {experience.experiencedAt.toISOString().slice(0, 10)}
          </span>
        </div>
        {experience.location && (
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3 w-3" />
            {experience.location}
          </span>
        )}
      </div>

      <Link
        href={`/experience/${experience.id}`}
        className="mt-1 block text-sm font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
      >
        {experience.title}
      </Link>

      {experience.description && (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{experience.description}</p>
      )}

      {experience.photos.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-1">
          {experience.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
              <Image src={photo.url} alt="" fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <LikeButton
        experienceId={experience.id}
        initialCount={experience._count.likes}
        initialLiked={experience.likes.length > 0}
      />

      {experience.comments && (
        <div className="mt-2 space-y-1 border-t border-slate-100 pt-2 dark:border-slate-800">
          {experience.comments.map((comment) => (
            <p key={comment.id} className="text-xs text-slate-600 dark:text-slate-400">
              <Link href={`/u/${comment.user.username}`} className="font-medium text-slate-900 dark:text-white">
                @{comment.user.username}
              </Link>{' '}
              {comment.text}
            </p>
          ))}
          <CommentForm experienceId={experience.id} />
        </div>
      )}
    </div>
  );
}
