-- ============================================================
-- RPC: create_board
--
-- Parameters:
--   p_title text
--
-- Returns: uuid - the new board's id
-- ============================================================

create or replace function public.create_board(p_title text)
returns uuid
language plpgsql
security invoker -- RLS is enforced
set search_path = public, pg_temp
as $$
declare
  v_board_id uuid;
begin
  insert into public.boards (user_id, title)
  values ((select auth.uid()), p_title)
  returning id into v_board_id;

  return v_board_id;
end;
$$;
