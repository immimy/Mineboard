-- ============================================================
-- RPC: update_list_fields
-- Updates, inserts, deletes, and reorders list_field rows atomically.
--
-- Parameters:
--   p_board_id          uuid   - the board whose fields are being updated
--   p_fields            jsonb  - array of { id, type, config }
--   p_delete_field_ids  uuid[] - existing field ids to delete
--
-- Returns: uuid - the updated board id
-- ============================================================

create index if not exists idx_list_values_list_field_id
  on public.list_values(list_field_id);

create or replace function public.update_list_fields(
  p_board_id uuid,
  p_fields jsonb default '[]'::jsonb,
  p_delete_field_ids uuid[] default array[]::uuid[]
)
returns uuid
language plpgsql
security invoker -- RLS is enforced
set search_path = public, pg_temp
as $$
begin
  -- Delete removed fields first. Dependent list_values are deleted by FK cascade.
  delete from public.list_fields
  where board_id = p_board_id
    and id = any(p_delete_field_ids);

  -- Parse the submitted array once and use array order as the source of truth.
  drop table if exists pg_temp.input_list_fields;

  create temp table input_list_fields on commit drop as
  select
    nullif(field->>'id', '')::uuid as id,
    (field->>'type')::public.field_type as type,
    coalesce(field->'config', '{}'::jsonb) as config,
    ordinality::integer - 1 as position
  from jsonb_array_elements(p_fields) with ordinality as item(field, ordinality);

  -- If an existing field changes type, remove all dependent values before
  -- updating the field. This avoids incompatible old values under the new type.
  delete from public.list_values as list_values
  using public.list_fields as list_fields
  join input_list_fields as input_fields
    on input_fields.id = list_fields.id
  where list_values.list_field_id = list_fields.id
    and list_fields.board_id = p_board_id
    and input_fields.type <> list_fields.type;

  -- Update existing fields.
  update public.list_fields as list_fields
  set type = input_fields.type,
      config = input_fields.config,
      position = input_fields.position
  from input_list_fields as input_fields
  where list_fields.board_id = p_board_id
    and list_fields.id = input_fields.id;

  -- Insert new fields. The server assigns real UUIDs.
  insert into public.list_fields (board_id, type, config, position)
  select
    p_board_id,
    input_fields.type,
    input_fields.config,
    input_fields.position
  from input_list_fields as input_fields
  where input_fields.id is null;

  return p_board_id;
end;
$$;
