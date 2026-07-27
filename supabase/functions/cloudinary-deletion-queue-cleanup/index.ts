import { withSupabase } from '@supabase/server';
import type { Database } from '../../database.types.ts';
import {
  deleteCloudinaryResources,
  type DeleteResourcesResult,
} from '../_shared/cloudinary.ts';
import {
  getPositiveInteger,
  jsonResponse,
  getErrorMessage,
  getCleanupAuth,
} from '../_shared/utils.ts';

const cleanupAuth = getCleanupAuth();

// ——— Types ———————————————————————————————————————————————

type DeletionClassification = {
  succeededPublicIds: string[];
  failedPublicIds: string[];
  deleted: number;
  notFound: number;
  error: string | null;
};

// ——— Helpers ———————————————————————————————————————————————

function readClaimedPublicIds(data: unknown): string[] {
  if (!Array.isArray(data)) throw new Error('Invalid claim RPC response');

  const publicIds = data.map(({ public_id }) => {
    if (!public_id || typeof public_id !== 'string')
      throw new Error('Invalid job returned by claim RPC');
    return public_id;
  });

  return [...new Set(publicIds)];
}

function classifyDeletionResult(
  publicIds: string[],
  result: DeleteResourcesResult,
): DeletionClassification {
  const succeededPublicIds: string[] = [];
  const failedPublicIds: string[] = [];
  let deleted = 0;
  let notFound = 0;

  for (const publicId of publicIds) {
    const status = result.deleted?.[publicId];

    if (status === 'deleted') {
      succeededPublicIds.push(publicId);
      deleted += 1;
      continue;
    }

    if (status === 'not_found') {
      succeededPublicIds.push(publicId);
      notFound += 1;
      continue;
    }

    failedPublicIds.push(publicId);
  }

  return {
    succeededPublicIds,
    failedPublicIds,
    deleted,
    notFound,
    error: failedPublicIds.length
      ? 'Cloudinary deletion failed with unexpected status'
      : null,
  };
}

// ——— Edge function ———————————————————————————————————————————————

const cloudinaryDeletionQueueCleanup = {
  fetch: withSupabase<Database>(
    {
      auth: cleanupAuth,
    },
    async (request, ctx) => {
      if (request.method !== 'POST')
        return jsonResponse({ error: 'Method not allowed' }, 405);

      try {
        const batchSize = getPositiveInteger({
          name: 'CLOUDINARY_DELETION_BATCH_SIZE',
          fallback: 50,
          max: 100,
        });
        const claimTtlSeconds = getPositiveInteger({
          name: 'CLOUDINARY_DELETION_CLAIM_TTL_SECONDS',
          fallback: 300,
          min: 60,
          max: 900,
        });
        const claimToken = crypto.randomUUID();

        // Claims deletion jobs from the database
        const { data: claimedJobs, error: claimError } =
          await ctx.supabaseAdmin.rpc('claim_cloudinary_deletion_jobs', {
            p_batch_size: batchSize,
            p_claim_token: claimToken,
            p_claim_ttl_seconds: claimTtlSeconds,
          });
        if (claimError)
          throw new Error(`Job claim failed: ${claimError.message}`);

        const publicIds = readClaimedPublicIds(claimedJobs);
        if (!publicIds.length)
          return jsonResponse({
            claimed: 0,
            deleted: 0,
            notFound: 0,
            retried: 0,
          });

        // Classifies deletion result
        // — 'deleted' and 'not_found' are evaluated as success
        // — other statuses are evaluated as failure
        let classification: DeletionClassification;

        // Deletes images from the Cloudinary
        try {
          const result = await deleteCloudinaryResources(publicIds);

          classification = classifyDeletionResult(publicIds, result);
        } catch (error) {
          classification = {
            succeededPublicIds: [],
            failedPublicIds: publicIds,
            deleted: 0,
            notFound: 0,
            error: getErrorMessage(error),
          };
        }

        // Report result back to the database
        // — Success: remove the jobs
        // — Failed: release the jobs for retry later
        const { data: finishedJobs, error: finishError } =
          await ctx.supabaseAdmin.rpc('finish_cloudinary_deletion_jobs', {
            p_claim_token: claimToken,
            p_error: classification.error ?? undefined,
            p_failed_public_ids: classification.failedPublicIds,
            p_succeeded_public_ids: classification.succeededPublicIds,
          });
        if (finishError)
          throw new Error(`Job completion failed: ${finishError.message}`);

        // Check every claimed job must end as either completed or retried.
        const { completed, retried } = finishedJobs[0];
        const finishedCount = completed + retried;
        if (finishedCount !== publicIds.length)
          throw new Error(
            `Finished ${finishedCount} of ${publicIds.length} claimed jobs`,
          );

        // Sends response back to the client
        const responseBody = {
          claimed: publicIds.length,
          deleted: classification.deleted,
          notFound: classification.notFound,
          retried: classification.failedPublicIds.length,
        };

        if (classification.failedPublicIds.length) {
          console.error('Some Cloudinary deletion jobs will retry', {
            count: classification.failedPublicIds.length,
            error: classification.error,
          });
          return jsonResponse(responseBody, 502);
        }

        return jsonResponse(responseBody);
      } catch (error) {
        console.error('Cloudinary deletion queue cleanup failed', error);
        return jsonResponse(
          { error: 'Cleanup failed and will retry later' },
          500,
        );
      }
    },
  ),
} satisfies Deno.ServeDefaultExport;

export default cloudinaryDeletionQueueCleanup;
