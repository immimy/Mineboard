-- Enable the "pg_graphql" extension
create extension if not exists pg_graphql;

-- ============================================================
-- TABLES
-- ============================================================

create table public.boards (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.cards (
  id          uuid primary key default gen_random_uuid(),
  board_id    uuid not null references public.boards(id) on delete cascade,
  title       text not null,
  color       text not null default '#3c83f6',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.lists (
  id          uuid primary key default gen_random_uuid(),
  card_id     uuid not null references public.cards(id) on delete cascade,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create type public.field_type as enum (
  'text',
  'number',
  'date',
  'image',
  'checkbox',
  'tag'
);

create table public.list_fields (
  id          uuid primary key default gen_random_uuid(),
  board_id    uuid not null references public.boards(id) on delete cascade,
  name        text not null,
  type        public.field_type not null,
  config      jsonb default '{}'::jsonb, -- default
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  unique (board_id, name)
);

create table public.list_values (
  id              uuid primary key default gen_random_uuid(),
  list_id         uuid not null references public.lists(id) on delete cascade,
  list_field_id   uuid not null references public.list_fields(id) on delete cascade,
  value           jsonb not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (list_id, list_field_id)
);


-- ============================================================
-- INDEXES
-- ============================================================

create index idx_boards_user_id  on public.boards(user_id);
create index idx_cards_board_id  on public.cards(board_id);
create index idx_cards_position  on public.cards(board_id, position);
create index idx_lists_card_id   on public.lists(card_id);
create index idx_lists_position  on public.lists(card_id, position);
create index idx_list_fields_board_id  on public.list_fields(board_id);
create index idx_list_fields_position  on public.list_fields(board_id, position);
create index idx_list_values_list_field  on public.list_values(list_id, list_field_id);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

-- Enable MODDATETIME extension
create extension if not exists moddatetime schema extensions;

-- This will set the `updated_at` column on every update
create trigger handle_updated_at before update on public.boards
  for each row execute procedure extensions.moddatetime (updated_at);
create trigger handle_updated_at before update on public.cards
  for each row execute procedure extensions.moddatetime (updated_at);
create trigger handle_updated_at before update on public.lists
  for each row execute procedure extensions.moddatetime (updated_at);
create trigger handle_updated_at before update on public.list_fields
  for each row execute procedure extensions.moddatetime (updated_at);
create trigger handle_updated_at before update on public.list_values
  for each row execute procedure extensions.moddatetime (updated_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.boards enable row level security;
alter table public.cards  enable row level security;
alter table public.lists  enable row level security;
alter table public.list_fields  enable row level security;
alter table public.list_values  enable row level security;

-- Boards: only owner can see/edit
create policy "boards: owner can manage their boards"
  on public.boards for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Cards: only owner can see/edit
create policy "cards: owner can manage their cards"
  on public.cards for all
  to authenticated
  using (
    exists (
      select 1 from public.boards
      where boards.id = cards.board_id
        and boards.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.boards
      where boards.id = cards.board_id
        and boards.user_id = (select auth.uid())
    )
  );

-- Lists: only owner can see/edit
create policy "lists: owner can manage their lists"
  on public.lists for all
  to authenticated
  using (
    exists (
      select 1 from public.cards
      join public.boards on boards.id = cards.board_id
      where cards.id = lists.card_id
        and boards.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.cards
      join public.boards on boards.id = cards.board_id
      where cards.id = lists.card_id
        and boards.user_id = (select auth.uid())
    )
  );

-- List_fields: only owner can see/edit
create policy "list_fields: owner can manage their list_fields"
  on public.list_fields for all
  to authenticated
  using (
    exists (
      select 1 from public.boards
      where boards.id = list_fields.board_id
        and boards.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.boards
      where boards.id = list_fields.board_id
        and boards.user_id = (select auth.uid())
    )
  );

-- List_values: only owner can see/edit
create policy "list_values: owner can manage their list_values"
  on public.list_values for all
  to authenticated
  using (
    exists (
      select 1 from public.lists
      join public.cards on cards.id = lists.card_id
      join public.boards on boards.id = cards.board_id
      where lists.id = list_values.list_id
        and boards.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.lists
      join public.cards on cards.id = lists.card_id
      join public.boards on boards.id = cards.board_id
      where lists.id = list_values.list_id
        and boards.user_id = (select auth.uid())
    )
  );