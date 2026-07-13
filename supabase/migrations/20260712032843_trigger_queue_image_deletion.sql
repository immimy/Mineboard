-- ============================================================
-- Queue Cloudinary image deletion jobs when image references
-- are removed by direct deletes or foreign-key cascades.
-- ============================================================

-- ============================================================
-- Trigger Helper: image deletion on list_field
-- ============================================================

create or replace function private.queue_list_field_images_before_delete()
returns trigger
language plpgsql
security definer
set search_path = private, pg_temp
as $$
begin
  if old.type = 'image' then
    perform private.queue_cloudinary_deletion_jobs(
      array(
        select distinct image.item #>> '{}' as public_id
        from public.list_values as list_values
        cross join lateral jsonb_array_elements(
          case
            when jsonb_typeof(list_values.value) = 'array'
              then list_values.value
            else '[]'::jsonb
          end
        ) as image(item)
        where list_values.list_field_id = old.id
          and jsonb_typeof(image.item) = 'string'
      )
    );
  end if;

  return old;
end;
$$;

revoke all on function private.queue_list_field_images_before_delete() from public;

-- ============================================================
-- Trigger Helper: image deletion on list_value
-- ============================================================

create or replace function private.queue_list_value_images_before_delete()
returns trigger
language plpgsql
security definer
set search_path = private, pg_temp
as $$
declare
  v_field_type public.field_type;
begin
  select list_fields.type
  into v_field_type
  from public.list_fields as list_fields
  where list_fields.id = old.list_field_id;

  if v_field_type = 'image' then
    perform private.queue_cloudinary_deletion_jobs(
      array(
        select image.item #>> '{}' as public_id
        from jsonb_array_elements(
          case
            when jsonb_typeof(old.value) = 'array' then old.value
            else '[]'::jsonb
          end
        ) as image(item)
        where jsonb_typeof(image.item) = 'string'
      )
    );
  end if;

  return old;
end;
$$;

revoke all on function private.queue_list_value_images_before_delete() from public;

-- ============================================================
-- Set before delete trigger on both list_field and list_value
-- ============================================================

create trigger queue_list_field_images_before_delete
before delete on public.list_fields
for each row
execute function private.queue_list_field_images_before_delete();

create trigger queue_list_value_images_before_delete
before delete on public.list_values
for each row
execute function private.queue_list_value_images_before_delete();
