'use server';

import { authenticateUser } from '@/utils/actions/auth';
import { getCloudinaryServerClient } from '@/utils/cloudinary/server';
import { createClient } from '@/utils/database/serverClient';
import {
  imageCleanupSchema,
  type ImageCleanupInput,
  validateWithZodSchema,
} from '@/utils/validation/validator';
import { renderError } from './helper';

type CloudinaryResource = {
  public_id: string;
  context?: {
    custom?: {
      owner_id?: unknown;
    };
  };
};

// Get the resources from Cloudinary and filter out the mismatched owner id
async function getOwnedPublicIds(publicIds: string[], ownerId: string) {
  const cloudinary = getCloudinaryServerClient();

  try {
    const result = await cloudinary.api.resources_by_ids(publicIds, {
      resource_type: 'image',
      type: 'upload',
      context: true,
    });

    return new Set(
      (result.resources as CloudinaryResource[])
        .filter((resource) => resource.context?.custom?.owner_id === ownerId)
        .map(({ public_id }) => public_id),
    );
  } catch (error) {
    console.error('Cloudinary cleanup could not verify assets', error);
    return new Set<string>();
  }
}

// Get the referenced images from the database
async function getReferencedIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  publicIds: string[],
) {
  if (!publicIds.length) return new Set<string>();

  const { data, error } = await supabase.rpc(
    'get_referenced_image_public_ids',
    { p_public_ids: publicIds },
  );
  if (error) throw new Error(error.message);

  return new Set((data ?? []).map(({ public_id }) => public_id));
}

export async function imageCleanup(input: unknown) {
  // Guard: only authenticated user can perform this action
  const supabase = await createClient();
  const user = await authenticateUser(supabase);

  // Input validation
  let validatedInput: ImageCleanupInput;
  try {
    validatedInput = validateWithZodSchema(imageCleanupSchema, input);
  } catch (error) {
    console.error('Invalid image cleanup input', error);
    return renderError(error, 'Invalid image cleanup input');
  }

  try {
    const savedIds =
      validatedInput.case === 'saved' ? validatedInput.savedIds : [];
    const { discardedIds } = validatedInput;
    const allIds = [...savedIds, ...discardedIds];
    if (!allIds.length) return { error: null };

    // Filter out the assets that do not belong to the current user
    const ownedIds = await getOwnedPublicIds(allIds, user.id);
    if (!ownedIds.size) return { error: null };
    const ownedSavedIds = savedIds.filter((publicId) => ownedIds.has(publicId));
    const ownedDiscardedIds = discardedIds.filter((publicId) =>
      ownedIds.has(publicId),
    );

    let tagRemovalIds = ownedSavedIds;
    let deletionIds = ownedDiscardedIds;

    // In case of cancelling the list dialog
    // Before deleting the images, check whether those images are referenced in the database to avoid removing the occupied images
    if (validatedInput.case === 'cancelled') {
      const referencedIds = await getReferencedIds(supabase, ownedDiscardedIds);
      tagRemovalIds = ownedDiscardedIds.filter((publicId) =>
        referencedIds.has(publicId),
      );
      deletionIds = ownedDiscardedIds.filter(
        (publicId) => !referencedIds.has(publicId),
      );
    }

    const cloudinary = getCloudinaryServerClient();
    const operations: Promise<unknown>[] = [];
    // Removes "unsaved" tag after persisting the image successfully
    if (tagRemovalIds.length)
      operations.push(cloudinary.uploader.remove_tag('unsaved', tagRemovalIds));
    // Deletes the orphaned images (upload but never persisted)
    if (deletionIds.length)
      operations.push(
        cloudinary.api.delete_resources(deletionIds, {
          resource_type: 'image',
          type: 'upload',
        }),
      );

    // The failed attempts could retry later by schedule cleanup.
    const operationResults = await Promise.allSettled(operations);
    operationResults.forEach((result) => {
      if (result.status === 'rejected')
        console.error('Cloudinary cleanup operation failed', result.reason);
    });

    return { error: null };
  } catch (error) {
    // console.error('Cloudinary image cleanup operation failed', error);
    return { error: null };
  }
}
