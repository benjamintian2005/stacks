import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
