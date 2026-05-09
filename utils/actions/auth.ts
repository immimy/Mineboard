import { redirect } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';

export const authenticateUser = async (
  supabase: SupabaseClient<any, 'public', 'public', any, any>,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect('/');
  return user;
};
