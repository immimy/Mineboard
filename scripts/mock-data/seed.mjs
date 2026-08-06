import {
  clearDemoImages,
  configureCloudinary,
  uploadImages,
} from './utils/cloudinary.mjs';
import {
  ENVIRONMENT_CONFIG,
  getEnvironment,
  getRequiredEnv,
} from './utils/config.mjs';
import { loadMockData } from './utils/data.mjs';
import { buildDatabaseRows } from './utils/rows.mjs';
import {
  clearDemoBoards,
  createSupabaseAdmin,
  insertRows,
  resolveDemoUser,
} from './utils/supabase.mjs';

async function main() {
  const environment = getEnvironment();
  const { boards, imageAssets } = await loadMockData();
  const supabase = createSupabaseAdmin();
  configureCloudinary();

  const user = await resolveDemoUser(supabase, environment);
  const cleanupOptions = {
    mode: getRequiredEnv('CLEANUP_MODE') || 'mock',
    mockBoardTitles: boards.map(({ title }) => title),
  };
  await clearDemoBoards(supabase, user.id, cleanupOptions);
  await clearDemoImages(environment, user.id, cleanupOptions);

  const { publicIdsByAssetKey, uploadedPublicIds } = await uploadImages({
    environment,
    imageAssets,
    ownerId: user.id,
  });

  const rows = buildDatabaseRows(boards, user.id, publicIdsByAssetKey);
  await insertRows(supabase, rows);

  console.log(
    `Created ${rows.boards.length} boards, ${rows.cards.length} cards and ${rows.lists.length} lists for ${user.email ?? user.id}.`,
  );
  console.log(
    `Uploaded ${uploadedPublicIds.length} images to ${ENVIRONMENT_CONFIG[environment].cloudinaryFolder}.`,
  );
}

main().catch((error) => {
  console.error(
    'Mock data creation failed. Run the same command again to clean up and retry:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
