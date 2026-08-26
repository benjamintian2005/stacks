import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getDb } from '@/lib/db';
import { requireUserId } from '@/lib/auth';
import LikeButton from '@/components/LikeButton';
import CommentForm from '@/components/CommentForm';
import DeleteExperienceButton from '@/components/DeleteExperienceButton';

export default async function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = await params;
  const userId = await requireUserId();

  const experience = await getDb().experience.findUnique({
    where: { id: experienceId },
    include: {
      user: true,
      photos: { orderBy: { position: 'asc' } },
      likes: { where: { userId } },
      _count: { select: { likes: true } },
      comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
    },
  });

  if (!experience) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
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

      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{experience.title}</h1>

      {experience.description && (
        <p className="mt-2 text-slate-700 dark:text-slate-300">{experience.description}</p>
      )}

      {experience.photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {experience.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <Image src={photo.url} alt="" fill sizes="400px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <LikeButton
        experienceId={experience.id}
        initialCount={experience._count.likes}
        initialLiked={experience.likes.length > 0}
      />

      {experience.userId === userId && <DeleteExperienceButton experienceId={experience.id} />}

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        {experience.comments.map((comment) => (
          <p key={comment.id} className="text-sm text-slate-600 dark:text-slate-400">
            <Link href={`/u/${comment.user.username}`} className="font-medium text-slate-900 dark:text-white">
              @{comment.user.username}
            </Link>{' '}
            {comment.text}
          </p>
        ))}
        <CommentForm experienceId={experience.id} />
      </div>
    </div>
  );
}
