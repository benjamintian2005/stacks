import { useParams } from 'react-router-dom';
import { useImportJob } from '../hooks/useImportJob';
import ImportMatchRow from '../components/ImportMatchRow';
import type { MediaType } from '../types/media';

const PLATFORM_MEDIA_TYPE: Record<string, MediaType> = {
  LETTERBOXD: 'MOVIE',
  GOODREADS: 'BOOK',
  RATEYOURMUSIC: 'ALBUM',
};

type ScrapedItem = { title: string; rating: number | null; platform: string };

export default function ImportReviewPage() {
  const { jobId } = useParams();
  const { data: job, isLoading } = useImportJob(jobId);

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  if (!job) {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Import job not found.</div>;
  }

  if (job.status === 'RUNNING' || job.status === 'PENDING') {
    return <div className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">Importing…</div>;
  }

  if (job.status === 'FAILED') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">Import failed{job.errorMessage ? `: ${job.errorMessage}` : '.'}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Goodreads and RateYourMusic imports are experimental and can break if those sites change their
          markup — Letterboxd's RSS-based import is the reliable path.
        </p>
      </div>
    );
  }

  const items = (Array.isArray(job.rawResultsJson) ? job.rawResultsJson : []) as ScrapedItem[];
  const mediaType = PLATFORM_MEDIA_TYPE[job.sourcePlatform] ?? 'MOVIE';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Confirm your matches</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Found {items.length} title{items.length === 1 ? '' : 's'}. Pick the correct match for each one to add
        it to your library — nothing is added automatically.
      </p>

      {items.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          Nothing was found. The profile may be private, empty, or the source site's markup may have changed.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <ImportMatchRow key={`${item.title}-${index}`} title={item.title} rating={item.rating} mediaType={mediaType} />
        ))}
      </div>
    </div>
  );
}
