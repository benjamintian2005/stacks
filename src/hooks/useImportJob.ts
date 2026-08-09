import { useMutation, useQuery } from '@tanstack/react-query';
import { client } from '../lib/amplifyClient';
import type { Schema } from '../../amplify/data/resource';

type ImportSourcePlatform = Schema['ImportSourcePlatform']['type'];

export function useImportJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ['importJob', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const { data } = await client.models.ImportJob.get({ id: jobId });
      return data;
    },
    enabled: !!jobId,
  });
}

export function useStartImport() {
  return useMutation({
    mutationFn: async ({
      sourcePlatform,
      sourceUrl,
    }: {
      sourcePlatform: ImportSourcePlatform;
      sourceUrl: string;
    }) => {
      // The frontend owns this row (not the Function) so owner-based auth is set correctly automatically.
      const { data: job, errors: createErrors } = await client.models.ImportJob.create({
        sourcePlatform,
        sourceUrl,
        status: 'RUNNING',
      });
      if (createErrors?.length || !job) {
        throw new Error(createErrors?.map((e) => e.message).join('; ') ?? 'Failed to start import');
      }

      try {
        const { data: results, errors: importErrors } = await client.queries.startImport({
          sourcePlatform,
          sourceUrl,
        });
        if (importErrors?.length) {
          throw new Error(importErrors.map((e) => e.message).join('; '));
        }

        const cleanResults = (results ?? []).filter((result): result is NonNullable<typeof result> => result != null);
        const { data: updated } = await client.models.ImportJob.update({
          id: job.id,
          status: 'COMPLETED',
          rawResultsJson: cleanResults,
        });
        return updated ?? job;
      } catch (err) {
        await client.models.ImportJob.update({
          id: job.id,
          status: 'FAILED',
          errorMessage: err instanceof Error ? err.message : 'Import failed',
        });
        throw err;
      }
    },
  });
}
