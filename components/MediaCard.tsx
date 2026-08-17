import Image from 'next/image';

type MediaCardData = {
  title: string;
  releaseYear?: number | null;
  coverImageUrl?: string | null;
};

export default function MediaCard({
  media,
  onClick,
  disabled,
}: {
  media: MediaCardData;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="block w-full text-left disabled:opacity-50">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-800">
          {media.coverImageUrl ? (
            <Image src={media.coverImageUrl} alt={media.title} fill sizes="200px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-slate-400">
              No cover
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{media.title}</p>
          {media.releaseYear && <p className="text-xs text-slate-500 dark:text-slate-400">{media.releaseYear}</p>}
        </div>
      </div>
    </button>
  );
}
