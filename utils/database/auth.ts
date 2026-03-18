'use server';

import { createClient } from '@/utils/database/serverClient';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FormState } from '@/types/types';

export async function signInWithGoogle(): Promise<FormState> {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Define ?next=/dashboard
      // Redirects authenticated user to the dashboard after succeed on exchange for a session
      redirectTo: `${origin}/api/auth?next=/dashboard`,
    },
  });

  if (error) return { error: error?.message || 'Failed to sign in' };

  redirect(data.url); // Redirect to Google's consent screen
}

export async function signOutWithGoogle(): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error?.message || 'Failed to sign out' };
  redirect('/'); // Redirect to homepage
}
