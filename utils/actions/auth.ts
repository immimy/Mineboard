import { redirect } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

export const authenticateUser = async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/');
  return user;
};
