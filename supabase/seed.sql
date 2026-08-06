-- Authentication fixtures only.
-- Domain mock data is created through scripts/mock-data/seed.mjs after reset.

do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_rls_user_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    role,
    aud,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
  ) values
  (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'demo@example.com',
    crypt('secret1234', gen_salt('bf')),
    now(), '', '', '', '',
    'authenticated', 'authenticated', now(), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "Demo User", "avatar_url": "https://api.dicebear.com/9.x/lorelei-neutral/png?seed=DemoUser&backgroundColor=b6e3f4"}',
    false
  ),
  (
    v_rls_user_id,
    '00000000-0000-0000-0000-000000000000',
    'rls@example.com',
    crypt('secret1234', gen_salt('bf')),
    now(), '', '', '', '',
    'authenticated', 'authenticated', now(), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "RLS User", "avatar_url": "https://api.dicebear.com/9.x/lorelei-neutral/png?seed=RLSUser&backgroundColor=ffdfbf"}',
    false
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values
  (
    v_user_id,
    v_user_id,
    'demo@example.com',
    jsonb_build_object('sub', v_user_id::text, 'email', 'demo@example.com'),
    'email', now(), now(), now()
  ),
  (
    v_rls_user_id,
    v_rls_user_id,
    'rls@example.com',
    jsonb_build_object('sub', v_rls_user_id::text, 'email', 'rls@example.com'),
    'email', now(), now(), now()
  );
end $$;
