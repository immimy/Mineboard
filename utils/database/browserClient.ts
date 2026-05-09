import { createBrowserClient } from '@supabase/ssr';
import { supabaseProjectUrl, supabasePublishableKey } from './config';

export function createClient() {
  return createBrowserClient(supabaseProjectUrl!, supabasePublishableKey!);
}
