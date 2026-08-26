-- ============================================================
-- RPC: save_board_layout
-- Saves card order and list placement/order atomically.
--
-- Parameters:
--   p_board_id         uuid   - the board whose layout is being saved
--   p_card_ids         uuid[] - every board card in display order
--   p_list_placements  jsonb  - array of { id, card_id, position }
--
-- Returns: uuid - the saved board id
-- ============================================================

create or replace function public.save_board_layout(
  p_board_id uuid,
  p_card_ids uuid[],
  p_list_placements jsonb
)
returns uuid
language plpgsql
security invoker -- RLS is enforced
set search_path = ''
as $$
declare
  v_max_cards_per_board integer;
  v_max_lists_per_board integer;
  v_database_card_count integer;
  v_payload_card_count integer;
  v_unique_card_count integer;
  v_database_list_count integer;
  v_payload_list_count integer;
  v_unique_list_count integer;
begin
  if p_board_id is null then
    raise exception 'Board id is required';
  end if;

  if p_card_ids is null then
    raise exception 'Card ids are required';
  end if;

  if p_list_placements is null
    or jsonb_typeof(p_list_placements) <> 'array'
  then
    raise exception 'List placements must be a JSON array';
  end if;

  -- Defensive guard: card and list must not exceed the limit per board
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

  -- Reject oversized input before parsing it into temporary tables.
  if cardinality(p_card_ids) > v_max_cards_per_board then
    raise exception using
      errcode = '23514',
      message = format(
        'A board cannot contain more than %s cards',
        v_max_cards_per_board
      );
  end if;

  if jsonb_array_length(p_list_placements) > v_max_lists_per_board then
    raise exception using
      errcode = '23514',
      message = format(
        'A board cannot contain more than %s lists',
        v_max_lists_per_board
      );
  end if;

  -- Serialize layout saves for this board, including saves from other clients.
  -- RLS makes an inaccessible board indistinguishable from a missing board.
  perform 1
  from public.boards
  where id = p_board_id
  for update;

  if not found then
    raise exception 'Board not found or access denied';
  end if;

  -- Parse each submitted layout once. These tables belong only to the current
  -- database session and are removed when the RPC transaction completes.
  drop table if exists pg_temp.input_board_layout_cards;
  drop table if exists pg_temp.input_board_layout_lists;

  create temp table input_board_layout_cards on commit drop as
  select
    provided.id,
    (provided.ordinality - 1)::integer as position
  from unnest(p_card_ids) with ordinality as provided(id, ordinality);

  create temp table input_board_layout_lists on commit drop as
  select
    placement.id,
    placement.card_id,
    placement.position
  from jsonb_to_recordset(p_list_placements)
    as placement(id uuid, card_id uuid, position integer);

  -- The full card snapshot must contain every card exactly once.
  select count(*)::integer
  into v_database_card_count
  from public.cards
  where board_id = p_board_id;

  select
    count(*)::integer,
    count(distinct provided.id)::integer
  into
    v_payload_card_count,
    v_unique_card_count
  from pg_temp.input_board_layout_cards as provided;

  -- Check the submitted card whether it
  -- - differs from the database
  -- - contains duplicate card IDs
  -- - does not belong to this board
  if v_payload_card_count <> v_database_card_count
    or v_unique_card_count <> v_payload_card_count
    or exists (
      select 1
      from pg_temp.input_board_layout_cards as provided
      left join public.cards as card
        on card.id = provided.id
        and card.board_id = p_board_id
      where card.id is null
    )
  then
    raise exception 'Card order does not match the board';
  end if;

  -- The full list snapshot must contain every board list exactly once.
  select count(*)::integer
  into v_database_list_count
  from public.lists as list
  join public.cards as card
    on card.id = list.card_id
  where card.board_id = p_board_id;

  select
    count(*)::integer,
    count(distinct placement.id)::integer
  into
    v_payload_list_count,
    v_unique_list_count
  from pg_temp.input_board_layout_lists as placement;

  if v_payload_list_count <> v_database_list_count
    or v_unique_list_count <> v_payload_list_count
  then
    raise exception 'List placements do not match the board';
  end if;

  -- Check whether each list
  -- - belongs to this board
  -- - targets another card on the same board
  -- - receives a non-negative position
  if exists (
    select 1
    from pg_temp.input_board_layout_lists as placement
    left join public.lists as list
      on list.id = placement.id
    left join public.cards as source_card
      on source_card.id = list.card_id
      and source_card.board_id = p_board_id
    left join public.cards as target_card
      on target_card.id = placement.card_id
      and target_card.board_id = p_board_id
    where source_card.id is null
      or target_card.id is null
      or placement.position is null
      or placement.position < 0
  )
  then
    raise exception 'Invalid list placement';
  end if;

  -- Positions within each non-empty card must be 0, 1, 2... without gaps.
  if exists (
    select placement.card_id
    from pg_temp.input_board_layout_lists as placement
    group by placement.card_id
    having min(placement.position) <> 0
      or max(placement.position) <> count(*)::integer - 1
      or count(distinct placement.position) <> count(*)
  )
  then
    raise exception 'List positions must be consecutive';
  end if;

  -- —— Update card order
  -- Array order is the source of truth for card position.
  update public.cards as card
  set position = desired.position
  from pg_temp.input_board_layout_cards as desired
  where card.id = desired.id
    and card.board_id = p_board_id
    and card.position is distinct from desired.position;

  -- —— Update list order
  -- A cross-card move updates card ownership and position together.
  update public.lists as list
  set
    card_id = desired.card_id,
    position = desired.position
  from pg_temp.input_board_layout_lists as desired
  where list.id = desired.id
    and (
      list.card_id is distinct from desired.card_id
      or list.position is distinct from desired.position
    );

  return p_board_id;
end;
$$;

revoke execute on function public.save_board_layout(uuid, uuid[], jsonb)
  from public;

grant execute on function public.save_board_layout(uuid, uuid[], jsonb)
  to authenticated;
