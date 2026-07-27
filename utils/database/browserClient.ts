import type { Database } from '@/supabase/database.types';
import { createBrowserClient } from '@supabase/ssr';
import { supabaseProjectUrl, supabasePublishableKey } from './config';

export function createClient() {
  return createBrowserClient<Database>(
    supabaseProjectUrl!,
    supabasePublishableKey!,
  );
}
