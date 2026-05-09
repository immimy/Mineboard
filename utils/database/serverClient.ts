import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseProjectUrl, supabasePublishableKey } from './config';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseProjectUrl!,
    supabasePublishableKey!,
    // To use Server-Side Rendering (SSR) with Supabase, you need to configure your Supabase client to use cookies.
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
}
