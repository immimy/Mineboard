-- ============================================================
-- RPC: create_card
--
-- Parameters:
--   p_board_id     uuid — the board this card belongs to
--   p_title        text
--   p_color        color_palette
--
-- Returns: uuid — the new card's id
-- ============================================================

create or replace function public.create_card(
  p_board_id  uuid,
  p_title     text,
  p_color     color_palette
)
returns uuid
language plpgsql
security invoker  -- RLS is enforced
set search_path = public, pg_temp
as $$
declare
  v_position  integer;
  v_card_id   uuid;
begin
  -- Derive the position for the new card
  select coalesce(max(position)+1,0)
    into v_position
    from public.cards
  where board_id = p_board_id;

  -- Insert the card row
  insert into public.cards (board_id, position, title, color)
  values (p_board_id, v_position, p_title, p_color)
  returning id into v_card_id;

  return v_card_id;
end;
$$;