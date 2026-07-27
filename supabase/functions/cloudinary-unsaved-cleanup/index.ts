import { withSupabase } from '@supabase/server';
import type { Database } from '../../database.types.ts';
import {
  deleteCloudinaryResources,
  removeCloudinaryTag,
  searchCloudinaryResources,
} from '../_shared/cloudinary.ts';
import {
  getCleanupAuth,
  getCleanupEnvironment,
  getPositiveInteger,
  jsonResponse,
} from '../_shared/utils.ts';

const cleanupEnvironment = getCleanupEnvironment();
const cleanupScope =
  cleanupEnvironment === 'production' ? 'AND NOT tags=dev' : 'AND tags=dev';
const cleanupAuth = getCleanupAuth();

const cloudinaryUnsavedCleanup = {
  fetch: withSupabase<Database>(
    {
      auth: cleanupAuth,
    },
    async (request, ctx) => {
      if (request.method !== 'POST')
        return jsonResponse({ error: 'Method not allowed' }, 405);

      try {
        const minAgeHours = getPositiveInteger({
          name: 'CLOUDINARY_UNSAVED_MAX_AGE_HOURS',
          fallback: 24, // 1 day
          min: 24,
        });
        const batchSize = getPositiveInteger({
          name: 'CLOUDINARY_UNSAVED_BATCH_SIZE',
          fallback: 50,
          max: 100,
        });
        const cutoff = new Date(Date.now() - minAgeHours * 60 * 60 * 1000);

        const expression = [
          'resource_type=image',
          'AND tags=unsaved',
          `AND created_at<"${cutoff.toISOString()}"`,
          cleanupScope,
        ].join(' ');

        // Query images from the Cloudinary
        const searchResult = await searchCloudinaryResources({
          expression,
          maxResults: batchSize,
        });
        const publicIds = searchResult.map(({ public_id }) => public_id);

        if (!publicIds.length)
          return jsonResponse({ searched: 0, repaired: 0, deleted: 0 });

        // Get referenced images from the database
        const { data, error } = await ctx.supabaseAdmin.rpc(
          'get_referenced_image_public_ids',
          { p_public_ids: publicIds },
        );
        if (error) throw new Error(`Reference lookup failed: ${error.message}`);

        // Classify the images
        const referencedIds = new Set(
          (data ?? []).map(({ public_id }) => public_id),
        );
        // 1. Referenced images
        //    Repaired — remove `unsaved` tag
        const tagRemovalIds = publicIds.filter((publicId) =>
          referencedIds.has(publicId),
        );
        // 2. Unreferenced images
        //    Removed — delete images from the cloud
        const deletionIds = publicIds.filter(
          (publicId) => !referencedIds.has(publicId),
        );

        // Requests to Cloudinary
        const operations: Promise<unknown>[] = [];
        if (tagRemovalIds.length)
          operations.push(removeCloudinaryTag('unsaved', tagRemovalIds));
        if (deletionIds.length)
          operations.push(deleteCloudinaryResources(deletionIds));

        const operationResults = await Promise.allSettled(operations);
        const failedOperations = operationResults.filter(
          (result) => result.status === 'rejected',
        );
        if (failedOperations.length)
          throw new Error(
            `${failedOperations.length} Cloudinary cleanup operation(s) failed`,
          );

        return jsonResponse({
          searched: publicIds.length,
          repaired: tagRemovalIds.length,
          deleted: deletionIds.length,
        });
      } catch (error) {
        console.error('Stale Cloudinary upload cleanup failed', error);
        return jsonResponse(
          { error: 'Cleanup failed and will retry later' },
          500,
        );
      }
    },
  ),
} satisfies Deno.ServeDefaultExport;

export default cloudinaryUnsavedCleanup;
