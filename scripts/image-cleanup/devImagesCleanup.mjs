import { v2 as cloudinary } from 'cloudinary';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env`);
  return value;
}

async function deleteDevImages() {
  if (getRequiredEnv('VERCEL_ENV') !== 'development')
    throw new Error('VERCEL_ENV must be "development" for a local reset');

  cloudinary.config({
    cloud_name: getRequiredEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
    api_key: getRequiredEnv('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
    api_secret: getRequiredEnv('CLOUDINARY_API_SECRET'),
  });

  let deleted = 0;
  let nextCursor;

  // Continues to delete a batch of images tagged dev until no more batches remain
  do {
    const result = await cloudinary.api.delete_resources_by_tag('dev', {
      resource_type: 'image',
      invalidate: true,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    deleted += Object.values(result.deleted ?? {}).filter(
      (status) => status === 'deleted',
    ).length;
    nextCursor = result.next_cursor;
  } while (nextCursor);

  console.log(`Deleted ${deleted} Cloudinary image(s) tagged "dev".`);
}

async function main() {
  await deleteDevImages();
}

main()
  .then(() => {
    console.log('Local post-db-reset follow-up succeeds.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Local post-db-reset follow-up failed:', error.message);
    process.exit(1);
  });
