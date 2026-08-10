import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Not found</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Go home
      </Link>
    </div>
  );
}
