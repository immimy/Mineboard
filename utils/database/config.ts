const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseProjectUrl) {
  throw new Error('Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_PROJECT_URL');
}
if (!supabasePublishableKey) {
  throw new Error(
    'Missing Supabase publishable key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  );
}

export { supabaseProjectUrl, supabasePublishableKey };
