'use server';

import { FormState } from '@/types/app';
import { createClient } from '@/utils/database/serverClient';
import { redirect } from 'next/navigation';

function renderError<T>(formState: FormState, error: T & { message: string }) {
  return { ...formState, error: error.message || 'An error occurred.' };
}

export async function signInWithEmail(
  formState: FormState,
  formData: FormData,
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: process.env.MOCK_USER_PASSWORD!,
  });
  if (error) return renderError(formState, error);
  if (data.user) redirect('/dashboard');
  return { ...formState };
}
