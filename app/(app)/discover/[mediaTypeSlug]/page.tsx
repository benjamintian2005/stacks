import { notFound } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import { mediaTypeFromSlug, MEDIA_TYPE_LABELS } from '@/lib/types';

export default async function DiscoverPage({ params }: { params: Promise<{ mediaTypeSlug: string }> }) {
  const { mediaTypeSlug } = await params;
  const mediaType = mediaTypeFromSlug(mediaTypeSlug);

  if (!mediaType) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
        Discover {MEDIA_TYPE_LABELS[mediaType]}
      </h1>
      <SearchBox mediaType={mediaType} />
    </div>
  );
}
