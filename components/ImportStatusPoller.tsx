'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const POLL_INTERVAL_MS = 2000;

// The import job now finishes in the background after the initial redirect, so this page can
// land on a still-RUNNING job — poll by re-fetching the server component until it settles.
export default function ImportStatusPoller() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
