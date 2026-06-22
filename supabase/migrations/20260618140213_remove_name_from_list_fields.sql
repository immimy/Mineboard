-- Remove name field from list_fields table

alter table public.list_fields
  drop constraint if exists list_fields_board_id_name_key;

alter table public.list_fields
  drop column if exists name;