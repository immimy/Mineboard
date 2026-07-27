-- ============================================================
-- Queue Cloudinary image deletion jobs for list_value changes
-- in statement-level batches.
--
-- The list_fields BEFORE DELETE row trigger from the previous
-- migration remains in place because it must read dependent
-- list_values before their foreign-key cascade removes them.
-- ============================================================

-- ============================================================
-- Replace the list_values row-level delete trigger
-- ============================================================

drop trigger if exists queue_list_value_images_before_delete
on public.list_values;

drop function if exists private.queue_list_value_images_before_delete();

-- ============================================================
-- Trigger Helper: image deletion after list_value deletes
-- ============================================================

create or replace function private.queue_list_value_images_after_delete()
returns trigger
language plpgsql
security definer
set search_path = private, pg_temp
as $$
begin
  perform private.queue_cloudinary_deletion_jobs(
    array(
      select distinct image.item #>> '{}' as public_id
      from deleted_list_values as deleted_value
      join public.list_fields as list_field
        on list_field.id = deleted_value.list_field_id
      cross join lateral jsonb_array_elements(
        case
          when jsonb_typeof(deleted_value.value) = 'array'
            then deleted_value.value
          else '[]'::jsonb
        end
      ) as image(item)
      where list_field.type = 'image'
        and jsonb_typeof(image.item) = 'string'
    )
  );

  return null;
end;
$$;

revoke all on function private.queue_list_value_images_after_delete()
from public;

create trigger queue_list_value_images_after_delete
after delete on public.list_values
referencing old table as deleted_list_values
for each statement
execute function private.queue_list_value_images_after_delete();

-- ============================================================
-- Trigger Helper: image deletion after list_value updates
-- ============================================================

create or replace function private.queue_list_value_images_after_update()
returns trigger
language plpgsql
security definer
set search_path = private, pg_temp
as $$
begin
  perform private.queue_cloudinary_deletion_jobs(
    array(
      select distinct old_image.item #>> '{}' as public_id
      from old_list_values as old_value
      join new_list_values as new_value
        on new_value.id = old_value.id
      join public.list_fields as list_field
        on list_field.id = old_value.list_field_id
      cross join lateral jsonb_array_elements(
        case
          when jsonb_typeof(old_value.value) = 'array'
            then old_value.value
          else '[]'::jsonb
        end
      ) as old_image(item)
      where list_field.type = 'image'
        and old_value.value is distinct from new_value.value
        and jsonb_typeof(old_image.item) = 'string'
        and not exists (
          select 1
          from jsonb_array_elements(
            case
              when jsonb_typeof(new_value.value) = 'array'
                then new_value.value
              else '[]'::jsonb
            end
          ) as new_image(item)
          where jsonb_typeof(new_image.item) = 'string'
            and new_image.item = old_image.item
        )
    )
  );

  return null;
end;
$$;

revoke all on function private.queue_list_value_images_after_update()
from public;

create trigger queue_list_value_images_after_update
after update on public.list_values
referencing old table as old_list_values
            new table as new_list_values
for each statement
execute function private.queue_list_value_images_after_update();
