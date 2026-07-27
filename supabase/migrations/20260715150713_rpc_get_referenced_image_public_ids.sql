-- ============================================================
-- Return candidate Cloudinary public IDs that are still stored
-- by image list values visible to the current database role.
-- ============================================================

create or replace function public.get_referenced_image_public_ids(
  p_public_ids text[] default array[]::text[]
)
returns table(public_id text)
language sql
stable
security invoker
set search_path = ''
as $$
  select distinct image.public_id
  from public.list_values as list_value
  join public.list_fields as list_field
    on list_field.id = list_value.list_field_id
  cross join lateral (
    select element.item #>> '{}' as public_id
    from jsonb_array_elements(
      case
        when jsonb_typeof(list_value.value) = 'array'
          then list_value.value
        else '[]'::jsonb
      end
    ) as element(item)
    where jsonb_typeof(element.item) = 'string'
  ) as image
  where list_field.type = 'image'
    and image.public_id = any(p_public_ids)
    and btrim(image.public_id) <> ''
    and image.public_id !~* '^https?://';
$$;

revoke all on function public.get_referenced_image_public_ids(text[])
from public;
revoke execute on function public.get_referenced_image_public_ids(text[])
from anon;
grant execute on function public.get_referenced_image_public_ids(text[])
to authenticated, service_role;
