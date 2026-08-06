import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import { ENVIRONMENT_CONFIG, getRequiredEnv } from './config.mjs';

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: getRequiredEnv(
      'CLOUDINARY_CLOUD_NAME',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    ),
    api_key: getRequiredEnv(
      'CLOUDINARY_API_KEY',
      'NEXT_PUBLIC_CLOUDINARY_API_KEY',
    ),
    api_secret: getRequiredEnv('CLOUDINARY_API_SECRET'),
  });
}

export async function uploadImages({ environment, imageAssets, ownerId }) {
  const { cloudinaryFolder, cloudinaryTags } = ENVIRONMENT_CONFIG[environment];
  const uploadedPublicIds = [];
  const publicIdsByAssetKey = new Map();

  for (const [assetKey, asset] of Object.entries(imageAssets)) {
    const result = await cloudinary.uploader.upload(asset.url, {
      resource_type: 'image',
      asset_folder: cloudinaryFolder,
      public_id: `${cloudinaryFolder}/${assetKey}`,
      overwrite: false,
      tags: cloudinaryTags,
      context: {
        owner_id: ownerId,
        mock_asset_key: assetKey,
      },
    });
    uploadedPublicIds.push(result.public_id);
    publicIdsByAssetKey.set(assetKey, result.public_id);
  }
  return { publicIdsByAssetKey, uploadedPublicIds };
}

async function findDemoImagePublicIds(environment, ownerId, mode) {
  const { data: userId, success } = z.uuid().safeParse(ownerId);
  if (!success) {
    throw new Error('Cloudinary cleanup requires a valid owner UUID.');
  }

  const { cloudinaryTags } = ENVIRONMENT_CONFIG[environment];
  const publicIds = [];
  let nextCursor;

  do {
    const result = await cloudinary.api.resources_by_context(
      'owner_id',
      userId,
      {
        resource_type: 'image',
        tags: mode === 'mock',
        max_results: 500,
        ...(nextCursor && { next_cursor: nextCursor }),
      },
    );

    publicIds.push(
      ...result.resources
        .filter(
          (resource) =>
            mode === 'all' ||
            cloudinaryTags.every((tag) => resource.tags?.includes(tag)),
        )
        .map(({ public_id: publicId }) => publicId),
    );
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return publicIds;
}

export async function clearDemoImages(environment, ownerId, { mode }) {
  if (!['all', 'mock', 'omit'].includes(mode))
    throw new Error("Supabase cleanup mode must be 'mock', 'all' or 'omit'.");

  if (mode === 'omit') {
    console.log('Omit the cleanup on existing demo images.');
    return;
  }

  const publicIds = await findDemoImagePublicIds(environment, ownerId, mode);

  for (let index = 0; index < publicIds.length; index += 100) {
    await cloudinary.api.delete_resources(publicIds.slice(index, index + 100), {
      resource_type: 'image',
      type: 'upload',
      invalidate: true,
    });
  }

  console.log(`Removed ${publicIds.length} existing images for the demo user.`);
}
