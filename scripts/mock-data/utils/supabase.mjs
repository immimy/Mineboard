import { createClient } from '@supabase/supabase-js';
import { getRequiredEnv } from './config.mjs';

export function createSupabaseAdmin() {
  return createClient(
    getRequiredEnv('SUPABASE_PROJECT_URL', 'NEXT_PUBLIC_SUPABASE_PROJECT_URL'),
    getRequiredEnv('SUPABASE_SECRET_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function resolveDemoUser(supabase, environment) {
  const allowedUser = getRequiredEnv('ALLOWED_DEMO_USER');
  const identifier = getRequiredEnv('DEMO_USER_IDENTIFIER');
  let user;

  if (environment === 'development') {
    // Find by email
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 2,
    });
    if (error) {
      throw new Error(`Could not list Supabase users: ${error.message}`);
    }
    user = data.users.find((candidate) => candidate.email === identifier);
  } else if (environment === 'production') {
    // Find by userid
    const { data, error } = await supabase.auth.admin.getUserById(identifier);
    if (error) {
      throw new Error(`Demo user was not found: ${error.message}`);
    }
    user = data.user;
  }

  if (user && user.email === allowedUser) return user;
  throw new Error(`Failed to resolve demo user.`);
}

export async function clearDemoBoards(
  supabase,
  userId,
  { mode, mockBoardTitles = [] },
) {
  if (!['all', 'mock', 'omit'].includes(mode))
    throw new Error("Supabase cleanup mode must be 'mock', 'all' or 'omit'.");

  if (mode === 'omit') {
    console.log('Omit the cleanup on existing demo boards.');
    return;
  }

  let query = supabase.from('boards').delete().eq('user_id', userId);

  if (mode === 'mock') {
    query = query.in('title', [...new Set(mockBoardTitles)]);
  }

  const { data, error } = await query.select('id');
  if (error) {
    throw new Error(`Could not remove existing demo boards: ${error.message}`);
  }
  console.log(`Removed ${data.length} existing boards for the demo user.`);
}

export async function insertRows(supabase, rows) {
  const inserts = [
    ['boards', rows.boards],
    ['list_fields', rows.listFields],
    ['cards', rows.cards],
    ['lists', rows.lists],
    ['list_values', rows.listValues],
  ];

  for (const [table, values] of inserts) {
    const { error } = await supabase.from(table).insert(values);
    if (error) {
      throw new Error(`Could not insert ${table}: ${error.message}`);
    }
  }
}
