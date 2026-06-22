-- ============================================================
-- RPC: create_list_fields
--
-- Parameters:
--   p_board_id uuid  - the board these fields belong to
--   p_fields   jsonb - array of { type, config }
--
-- Returns: board id
-- ============================================================

create or replace function public.create_list_fields(
  p_board_id uuid,
  p_fields jsonb
)
returns uuid
language plpgsql
security invoker -- RLS is enforced
set search_path = public, pg_temp
as $$
declare
  v_start_position integer;
begin
  -- Derive the start position for list fields
  select coalesce(max(list_fields.position) + 1, 0)
    into v_start_position
    from public.list_fields
  where board_id = p_board_id;

  -- Parse the jsonb input into rows with ordinal number
  -- and temporarily store it
  with input_fields as (
    select
      value as field,
      ordinality::integer - 1 as position_offset
    from jsonb_array_elements(p_fields) with ordinality
  )
  -- Insert each input rows to list_fields table
  insert into public.list_fields (board_id, type, config, position)
  select
    p_board_id,
    (field->>'type')::public.field_type,
    coalesce(field->'config', '{}'::jsonb),
    v_start_position + position_offset
  from input_fields;

  return p_board_id;
end;
$$;
