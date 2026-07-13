-- ============================================================
-- RPC: update_list
-- Updates, inserts, and deletes list_value rows atomically.
--
-- Parameters:
--   p_list_id       uuid  - the list whose values are being updated
--   p_update_values jsonb - array of { list_value_id, value }
--   p_insert_values jsonb - array of { list_field_id, value }
--   p_delete_values uuid[] - array of list_value ids to delete
--
-- Returns: uuid - the updated list id
-- ============================================================

create or replace function public.update_list(
  p_list_id uuid,
  p_update_values jsonb default '[]'::jsonb,
  p_insert_values jsonb default '[]'::jsonb,
  p_delete_values uuid[] default array[]::uuid[]
)
returns uuid
language plpgsql
security invoker -- RLS is enforced
set search_path = public, pg_temp
as $$
begin
  -- Update existing list_value rows. Each row can receive a different JSON value.
  with input_updates as (
    select
      (item->>'list_value_id')::uuid as list_value_id,
      item->'value' as value
    from jsonb_array_elements(p_update_values) as item
  )
  update public.list_values as list_values
  set value = input_updates.value
  from input_updates
  where list_values.id = input_updates.list_value_id
    and list_values.list_id = p_list_id;

  -- Insert newly filled field values.
  insert into public.list_values (list_id, list_field_id, value)
  select
    p_list_id,
    (item->>'list_field_id')::uuid,
    item->'value'
  from jsonb_array_elements(p_insert_values) as item;

  -- Delete values for fields that were cleared.
  delete from public.list_values
  where list_id = p_list_id
    and id = any(p_delete_values);

  return p_list_id;
end;
$$;
