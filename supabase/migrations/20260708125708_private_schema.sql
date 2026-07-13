-- ============================================================
-- Private Schema
-- ============================================================

create schema if not exists private;

-- Privilege: private schema
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

-- Cloudinary Deletion Jobs Table
create table if not exists private.cloudinary_deletion_jobs (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_cloudinary_deletion_jobs_next_attempt
  on private.cloudinary_deletion_jobs(next_attempt_at, created_at);

-- Privilege: cloudinary_deletion_jobs table
revoke all on private.cloudinary_deletion_jobs from public;
revoke all on private.cloudinary_deletion_jobs from authenticated;

-- ============================================================
-- Insert the job to `cloudinary_deletion_jobs` table helper
-- ============================================================

create or replace function private.queue_cloudinary_deletion_jobs(
  p_public_ids text[] default array[]::text[]
)
returns void
language sql
security definer
set search_path = private, pg_temp
as $$
  insert into private.cloudinary_deletion_jobs(public_id)
  select distinct public_id
  from unnest(p_public_ids) as public_ids(public_id)
  where public_id is not null
  -- Filters out empty strings and http/https URLs
  -- so seed/dev image URLs are not queued as Cloudinary public IDs.
    and btrim(public_id) <> ''
    and public_id !~* '^https?://'
  on conflict (public_id) do nothing;
$$;

revoke all on function private.queue_cloudinary_deletion_jobs(text[]) from public;
revoke execute on function private.queue_cloudinary_deletion_jobs(text[]) from authenticated;