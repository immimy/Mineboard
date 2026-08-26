-- ============================================================
-- Board layout size limits
--
-- These triggers keep layout saves predictably bounded regardless of whether
-- rows are created through an RPC, GraphQL, or another database client.
-- ============================================================

-- Check whether the existing cards and lists violate the size limits.
-- If it exceeds, resolve any violating board before applying this migration.
do $$
declare
  v_max_cards_per_board integer;
  v_max_lists_per_board integer;
begin
  select
    limits.max_cards_per_board,
    limits.max_lists_per_board
  into
    v_max_cards_per_board,
    v_max_lists_per_board
  from private.board_layout_limits as limits
  where limits.singleton;

  if not found then
    raise exception 'Board layout limits are not configured';
  end if;

  if exists (
    select 1
    from public.cards as card
    group by card.board_id
    having count(*) > v_max_cards_per_board
  ) then
    raise exception using
      errcode = '23514',
      message = format(
        'An existing board contains more than %s cards',
        v_max_cards_per_board
      );
  end if;

  if exists (
    select 1
    from public.lists as list
    join public.cards as card
      on card.id = list.card_id
    group by card.board_id
    having count(*) > v_max_lists_per_board
  ) then
    raise exception using
      errcode = '23514',
      message = format(
        'An existing board contains more than %s lists',
        v_max_lists_per_board
      );
  end if;
end;
$$;

-- ============================================================
-- ———— Board card limit trigger
-- ============================================================

create or replace function private.enforce_board_card_limit()
returns trigger
language plpgsql
security invoker -- RLS is enforced
set search_path = ''
as $$
declare
  v_max_cards_per_board integer;
begin
  -- If this is an update and the card remains on the same board,
  -- allow the update immediately without checking the board’s card limit.
  if tg_op = 'UPDATE' and new.board_id = old.board_id then
    return new;
  end if;

  -- Serialize capacity checks with card creation and board layout saves.
  perform 1
  from public.boards
  where id = new.board_id
  for update;

  if not found then
    raise exception 'Board not found or access denied';
  end if;

  select limits.max_cards_per_board
  into v_max_cards_per_board
  from private.board_layout_limits as limits
  where limits.singleton;

  if not found then
    raise exception 'Board layout limits are not configured';
  end if;

  if (
    select count(*)
    from public.cards
    where board_id = new.board_id
  ) >= v_max_cards_per_board
  then
    raise exception using
      errcode = '23514',
      message = format(
        'A board cannot contain more than %s cards',
        v_max_cards_per_board
      );
  end if;

  return new;
end;
$$;

revoke execute on function private.enforce_board_card_limit()
  from public;

-- Setup the card limit trigger
create trigger enforce_board_card_limit
before insert or update of board_id
on public.cards
for each row
execute function private.enforce_board_card_limit();

-- ============================================================
-- ———— Board list limit trigger
-- ============================================================

create or replace function private.enforce_board_list_limit()
returns trigger
language plpgsql
security invoker -- RLS is enforced
set search_path = ''
as $$
declare
  v_max_lists_per_board integer;
  v_source_board_id uuid;
  v_target_board_id uuid;
begin
  -- Lock the target board before counting. Every list insert targeting the
  -- same board must therefore finish its check before the next one begins.
  select card.board_id
  into v_target_board_id
  from public.cards as card
  join public.boards as board
    on board.id = card.board_id
  where card.id = new.card_id
  for update of board;

  if not found then
    raise exception 'Card not found or access denied';
  end if;

  if tg_op = 'UPDATE' then
    select card.board_id
    into v_source_board_id
    from public.cards as card
    where card.id = old.card_id;

    -- Reordering a list between cards on the same board does not change the
    -- board's total list count, so no capacity check is needed.
    if v_source_board_id = v_target_board_id then
      return new;
    end if;
  end if;

  select limits.max_lists_per_board
  into v_max_lists_per_board
  from private.board_layout_limits as limits
  where limits.singleton;

  if not found then
    raise exception 'Board layout limits are not configured';
  end if;

  if (
    select count(*)
    from public.lists as list
    join public.cards as card
      on card.id = list.card_id
    where card.board_id = v_target_board_id
  ) >= v_max_lists_per_board
  then
    raise exception using
      errcode = '23514',
      message = format(
        'A board cannot contain more than %s lists',
        v_max_lists_per_board
      );
  end if;

  return new;
end;
$$;

revoke execute on function private.enforce_board_list_limit()
  from public;

-- Setup list limit trigger
create trigger enforce_board_list_limit
before insert or update of card_id
on public.lists
for each row
execute function private.enforce_board_list_limit();
