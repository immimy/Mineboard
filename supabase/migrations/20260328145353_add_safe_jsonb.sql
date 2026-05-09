/** Markdown is located at '../README/migration_name.md'
 */

-- ============================================================
-- The Validation Function
-- ============================================================

create or replace function is_safe_jsonb(data jsonb)
    returns bool
    language sql
    set search_path = ''
as $$
    select not exists (
        select 1
        from pg_catalog.jsonb_array_elements_text(
            pg_catalog.jsonb_path_query_array(data, 'strict $.** ? (@.type() == "string")')
        ) as val
        where
            val operator(pg_catalog.~*) '</?[a-z][^>]*>'
    )
$$;

create domain safe_jsonb as jsonb
    constraint no_prohibited_strings
    check ( is_safe_jsonb(value) );

-- ============================================================
-- Alter all jsonb columns to safe_jsonb
-- ============================================================

alter table public.list_fields
    alter column config type safe_jsonb;

alter table public.list_values
    alter column value type safe_jsonb;