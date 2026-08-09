import { useParams } from 'react-router-dom';

/** Placeholder for routes whose full implementation lands in a later phase. */
export default function RouteStub({ title }: { title: string }) {
  const params = useParams();
  const paramEntries = Object.entries(params);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
      {paramEntries.length > 0 && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {paramEntries.map(([key, value]) => `${key}=${value}`).join(', ')}
        </p>
      )}
      <p className="mt-4 text-slate-500 dark:text-slate-400">Coming in a later phase.</p>
    </div>
  );
}
