-- ============================================================
-- SEED DATA
-- ============================================================
-- Two boards, four cards, multiple lists with sparse field values.
-- ============================================================

do $$
declare

  -- mock user
  v_user_id       uuid := gen_random_uuid();
  v_rls_user_id   uuid := gen_random_uuid();

  -- boards
  v_board_todo    uuid := gen_random_uuid();
  v_board_project uuid := gen_random_uuid();

  -- cards (todo board)
  v_card_personal uuid := gen_random_uuid();
  v_card_work     uuid := gen_random_uuid();

  -- cards (project board)
  v_card_design   uuid := gen_random_uuid();
  v_card_dev      uuid := gen_random_uuid();

  -- list_fields (todo board)
  v_field_checkbox_1  uuid := gen_random_uuid();
  v_field_date_1      uuid := gen_random_uuid();
  v_field_text_1      uuid := gen_random_uuid();
  v_field_tag_1       uuid := gen_random_uuid();

  -- list_fields (project board)
  v_field_tag_2       uuid := gen_random_uuid();
  v_field_tag_3       uuid := gen_random_uuid();
  v_field_date_2      uuid := gen_random_uuid();
  v_field_image_1     uuid := gen_random_uuid();
  v_field_number_1    uuid := gen_random_uuid();

  -- lists (personal card)
  v_list_p1 uuid := gen_random_uuid();
  v_list_p2 uuid := gen_random_uuid();
  v_list_p3 uuid := gen_random_uuid();

  -- lists (work card)
  v_list_w1 uuid := gen_random_uuid();
  v_list_w2 uuid := gen_random_uuid();

  -- lists (design card)
  v_list_d1 uuid := gen_random_uuid();
  v_list_d2 uuid := gen_random_uuid();
  v_list_d3 uuid := gen_random_uuid();

  -- lists (dev card)
  v_list_v1 uuid := gen_random_uuid();
  v_list_v2 uuid := gen_random_uuid();
  v_list_v3 uuid := gen_random_uuid();

begin

  -- ============================================================
  -- MOCK USER
  -- ============================================================

  -- Owner user
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
  ) values (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'seed@example.com',
    crypt('secret1234', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    'authenticated',
    'authenticated',
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "Seed User", "avatar_url": "https://api.dicebear.com/9.x/lorelei-neutral/png?seed=SeedUser&backgroundColor=b6e3f4"}',
    false
  );
  -- Required for authentication via email
  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    v_user_id, -- ← must match user_id
    v_user_id,
    'seed@example.com',
    jsonb_build_object(
      'sub',   v_user_id::text,
      'email', 'seed@example.com'
    ),
    'email',
    now(),
    now(),
    now()
  );

  -- RLS test user
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
  ) values (
    v_rls_user_id,
    '00000000-0000-0000-0000-000000000000',
    'rls@example.com',
    crypt('secret1234', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    'authenticated',
    'authenticated',
    now(),
    now(),
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
  ) values (
    v_rls_user_id,
    v_rls_user_id,
    'rls@example.com',
    jsonb_build_object(
      'sub',   v_rls_user_id::text,
      'email', 'rls@example.com'
    ),
    'email',
    now(),
    now(),
    now()
  );

  -- ============================================================
  -- BOARDS
  -- ============================================================

  insert into public.boards (id, user_id, title) values
    (v_board_todo,    v_user_id, 'Personal to-do'),
    (v_board_project, v_user_id, 'Website redesign');


  -- ============================================================
  -- CARDS
  -- ============================================================

  insert into public.cards (id, board_id, title, color, position) values
    -- todo board
    (v_card_personal, v_board_todo, 'Personal',  1, 0),
    (v_card_work,     v_board_todo, 'Work',      7, 1),
    -- project board
    (v_card_design,   v_board_project, 'Design',      2, 0),
    (v_card_dev,      v_board_project, 'Development', 6, 1);


  -- ============================================================
  -- LIST FIELDS — todo board
  -- Users can pick any of these fields when creating a list item.
  -- ============================================================

  insert into public.list_fields (id, board_id, type, config, position) values
    (
      v_field_checkbox_1,
      v_board_todo,
      'checkbox',
      '{}'::jsonb,
      0
    ),
    (
      v_field_date_1, 
      v_board_todo,
      'date',
      '{"title": "Deadline", "isIncludeTime": false}'::jsonb,
      1
    ),
    (
      v_field_text_1, 
      v_board_todo,
      'text',
      '{"title": "Note"}'::jsonb,
      2
    ),
    (
      v_field_tag_1, 
      v_board_todo,
      'tag',
      '{"color": 3}'::jsonb,
      3
    );


  -- ============================================================
  -- LIST FIELDS — project board
  -- ============================================================

  insert into public.list_fields (id, board_id, type, config, position) values
    (
      v_field_tag_2, 
      v_board_project,
      'tag',
      '{"color": 5}'::jsonb,
      0
    ),
    (
      v_field_tag_3, 
      v_board_project,
      'tag',
      '{"color": 7}'::jsonb,
      1
    ),
    (
      v_field_date_2, 
      v_board_project,
      'date',
      '{"title": "Due date", "isIncludeTime": true}'::jsonb,
      2
    ),
    (
      v_field_image_1, 
      v_board_project,
      'image',
      '{"title": "Cover"}'::jsonb,
      3
    ),
    (
      v_field_number_1, 
      v_board_project,
      'number',
      '{"title": "Estimate", "isHasUnit": true, "unit": "hrs", "unitPosition": "back"}'::jsonb,
      4
    );


  -- ============================================================
  -- LISTS — personal card
  -- Sparse values: each item only has the fields it needs.
  -- ============================================================

  insert into public.lists (id, card_id, position) values
    (v_list_p1, v_card_personal, 0),
    (v_list_p2, v_card_personal, 1),
    (v_list_p3, v_card_personal, 2);

  -- Buy groceries: date_1 + tag_1
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_p1, v_field_date_1,
      '"2026-04-01"'::jsonb
    ),
    (
      v_list_p1, v_field_tag_1,
      '[{"tag": "groceries", "color": 3}, {"tag": "errands"}]'::jsonb
    );

  -- Read a book: checkbox_1 + text_1
  -- fix: checkbox value.data is now { checked: boolean; title: string }, not a flat boolean
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_p2, v_field_checkbox_1,
      '{"checked": false, "title": "Mark as done"}'::jsonb
    ),
    (
      v_list_p2, v_field_text_1,
      '"Start with Atomic Habits"'::jsonb
    );

  -- Morning run: checkbox_1 only
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_p3, v_field_checkbox_1,
      '{"checked": true, "title": "Mark as done"}'::jsonb
    );


  -- ============================================================
  -- LISTS — work card
  -- ============================================================

  insert into public.lists (id, card_id, position) values
    (v_list_w1, v_card_work, 0),
    (v_list_w2, v_card_work, 1);

  -- Send invoice: checkbox_1 + date_1
  -- fix: checkbox shape
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_w1, v_field_checkbox_1,
      '{"checked": false, "title": "Mark as done"}'::jsonb
    ),
    (
      v_list_w1, v_field_date_1,
      '"2026-03-31"'::jsonb
    );

  -- Prepare slides: date_1 + tag_1 + text_1
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_w2, v_field_date_1,
      '"2026-04-05"'::jsonb
    ),
    (
      v_list_w2, v_field_tag_1,
      '[{"tag": "presentation", "color": 2}, {"tag": "q2", "color": 6}]'::jsonb
    ),
    (
      v_list_w2, v_field_text_1,
      '"Cover Q1 metrics and roadmap"'::jsonb
    );


  -- ============================================================
  -- LISTS — design card
  -- ============================================================

  insert into public.lists (id, card_id, position) values
    (v_list_d1, v_card_design, 0),
    (v_list_d2, v_card_design, 1),
    (v_list_d3, v_card_design, 2);

  -- Homepage wireframe: tag_2 + tag_3 + date_2 + image_1 + number_1
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_d1, v_field_tag_2,
      '[{"tag": "in progress", "color": 5}]'::jsonb
    ),
    (
      v_list_d1, v_field_tag_3,
      '[{"tag": "high", "color": 1}]'::jsonb
    ),
    (
      v_list_d1, v_field_date_2,
      '"2026-04-10T17:00:00Z"'::jsonb
    ),
    (
      v_list_d1, v_field_image_1,
      '["https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb
    ),
    (
      v_list_d1, v_field_number_1,
      '8'::jsonb
    );

  -- Icon set: tag_2 + number_1
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_d2, v_field_tag_2,
      '[{"tag": "todo", "color": 4}]'::jsonb
    ),
    (
      v_list_d2, v_field_number_1,
      '3.5'::jsonb
    );

  -- Brand colours: tag_2 + tag_3
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_d3, v_field_tag_2,
      '[{"tag": "done", "color": 3}]'::jsonb
    ),
    (
      v_list_d3, v_field_tag_3,
      '[{"tag": "low", "color": 8}]'::jsonb
    );


  -- ============================================================
  -- LISTS — dev card
  -- ============================================================

  insert into public.lists (id, card_id, position) values
    (v_list_v1, v_card_dev, 0),
    (v_list_v2, v_card_dev, 1),
    (v_list_v3, v_card_dev, 2);

  -- Set up Next.js: tag_2 + date_2 + number_1
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_v1, v_field_tag_2,
      '[{"tag": "done", "color": 3}]'::jsonb
    ),
    (
      v_list_v1, v_field_date_2,
      '"2026-03-20T09:00:00Z"'::jsonb
    ),
    (
      v_list_v1, v_field_number_1,
      '2'::jsonb
    );

  -- Supabase schema: tag_2 + tag_3 + number_1
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_v2, v_field_tag_2,
      '[{"tag": "in progress", "color": 5}]'::jsonb
    ),
    (
      v_list_v2, v_field_tag_3,
      '[{"tag": "high", "color": 1}]'::jsonb
    ),
    (
      v_list_v2, v_field_number_1,
      '5'::jsonb
    );

  -- Deploy to Vercel: tag_2 + date_2
  insert into public.list_values (list_id, list_field_id, value) values
    (
      v_list_v3, v_field_tag_2,
      '[{"tag": "todo", "color": 4}]'::jsonb
    ),
    (
      v_list_v3, v_field_date_2,
      '"2026-04-15T12:00:00Z"'::jsonb
    );

end $$;
