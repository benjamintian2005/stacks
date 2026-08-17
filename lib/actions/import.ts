'use server';

import { after } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { runImport, type ImportPlatform } from '@/lib/import';

export async function startImport(sourcePlatform: ImportPlatform, sourceUrl: string): Promise<string> {
  const userId = await requireUserId();

  const job = await getDb().importJob.create({
    data: { userId, sourcePlatform, sourceUrl, status: 'RUNNING' },
  });

  // Scraping runs after the response is sent instead of blocking this action — a Goodreads/RYM
  // profile scrape can take well past what feels responsive for a form submit.
  after(async () => {
    try {
      const items = await runImport(sourcePlatform, sourceUrl);
      await getDb().importJob.update({
        where: { id: job.id },
        data: { status: 'COMPLETED', rawResultsJson: items },
      });
    } catch (err) {
      await getDb().importJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', errorMessage: err instanceof Error ? err.message : 'Import failed' },
      });
    }
  });

  return job.id;
}

export async function confirmImportMatch(input: { mediaItemId: string; rating: number | null }) {
  const userId = await requireUserId();
  const scaledRating = input.rating != null ? input.rating * 2 : undefined; // 0-5 scraped -> our 0-10 scale

  await getDb().libraryEntry.upsert({
    where: { userId_mediaItemId: { userId, mediaItemId: input.mediaItemId } },
    update: { status: 'COMPLETED', rating: scaledRating },
    create: { userId, mediaItemId: input.mediaItemId, status: 'COMPLETED', rating: scaledRating },
  });

  const entry = await getDb().diaryEntry.create({
    data: { userId, mediaItemId: input.mediaItemId, rating: scaledRating, loggedDate: new Date() },
  });

  await getDb().activityEvent.create({
    data: { actorId: userId, eventType: 'LOGGED_DIARY', mediaItemId: input.mediaItemId, diaryEntryId: entry.id },
  });
}
