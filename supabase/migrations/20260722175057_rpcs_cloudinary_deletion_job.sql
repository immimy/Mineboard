-- ============================================================
-- Prevents possibly concurrent workers claim the same job
-- Additional columns indicate that the job's already been claimed
-- ============================================================

alter table private.cloudinary_deletion_jobs
add column if not exists claim_token uuid,
add column if not exists claim_expires_at timestamptz;

-- ============================================================
-- Claim jobs without blocking concurrent workers
-- ============================================================

create or replace function public.claim_cloudinary_deletion_jobs(
  p_claim_token uuid,
  p_batch_size integer default 50,
  p_claim_ttl_seconds integer default 300 -- 5 mins
)
returns table(public_id text)
language plpgsql
security definer
set search_path = private, pg_temp
as $$
begin
  if p_claim_token is null then
    raise exception 'p_claim_token is required' using errcode = '22023';
  end if;

  if p_batch_size < 1 or p_batch_size > 100 then
    raise exception 'p_batch_size must be between 1 and 100'
      using errcode = '22023';
  end if;

  if p_claim_ttl_seconds < 60 or p_claim_ttl_seconds > 900 then
    raise exception 'p_claim_ttl_seconds must be between 60 and 900'
      using errcode = '22023';
  end if;

  return query
  with claimable_jobs as (
    select deletion_job.id
    from private.cloudinary_deletion_jobs as deletion_job
    where deletion_job.next_attempt_at <= now()
      -- claims the rows that are not in the process of other workers
      and (
        deletion_job.claim_expires_at is null
        or deletion_job.claim_expires_at <= now()
      )
    order by deletion_job.next_attempt_at, deletion_job.created_at
    limit p_batch_size
    for update skip locked
    -- for update — lock this row when query
    -- skip locked — skip locked rows and move to the next rows
  )
  update private.cloudinary_deletion_jobs as deletion_job
  set claim_token = p_claim_token,
      claim_expires_at = now() + make_interval(secs => p_claim_ttl_seconds),
      attempts = deletion_job.attempts + 1
  from claimable_jobs
  where deletion_job.id = claimable_jobs.id
  returning deletion_job.public_id;
end;
$$;

revoke all on function public.claim_cloudinary_deletion_jobs(uuid, integer, integer)
from public;
grant execute on function public.claim_cloudinary_deletion_jobs(uuid, integer, integer)
to service_role;

-- ============================================================
-- Delete successful jobs and release failed jobs for the next run
-- ============================================================

create or replace function public.finish_cloudinary_deletion_jobs(
  p_claim_token uuid,
  p_succeeded_public_ids text[] default array[]::text[],
  p_failed_public_ids text[] default array[]::text[],
  p_error text default null
)
returns table(completed integer, retried integer)
language plpgsql
security definer
set search_path = private, pg_temp
as $$
declare
  v_completed integer;
  v_retried integer;
begin
  if p_claim_token is null then
    raise exception 'p_claim_token is required' using errcode = '22023';
  end if;

  if exists (
    select succeeded.public_id
    from unnest(coalesce(p_succeeded_public_ids, array[]::text[]))
      as succeeded(public_id)
    intersect
    select failed.public_id
    from unnest(coalesce(p_failed_public_ids, array[]::text[]))
      as failed(public_id)
  ) then
    raise exception 'A job cannot be both succeeded and failed'
      using errcode = '22023';
  end if;

  -- Delete successful jobs from the database
  with completed_jobs as (
    delete from private.cloudinary_deletion_jobs as deletion_job
    where deletion_job.claim_token = p_claim_token
      and deletion_job.public_id = any(
        coalesce(p_succeeded_public_ids, array[]::text[])
      )
    returning deletion_job.id
  )
  select count(*)::integer
  into v_completed
  from completed_jobs;

  -- Release failed jobs for the next run
  with retried_jobs as (
    update private.cloudinary_deletion_jobs as deletion_job
    set last_error = left(
          coalesce(nullif(btrim(p_error), ''), 'Cloudinary deletion failed'),
          1000
        ),
        claim_token = null,
        claim_expires_at = null,
        next_attempt_at = now() + interval '24 hours'
    where deletion_job.claim_token = p_claim_token
      and deletion_job.public_id = any(
        coalesce(p_failed_public_ids, array[]::text[])
      )
    returning deletion_job.id
  )
  select count(*)::integer
  into v_retried
  from retried_jobs;

  return query select v_completed, v_retried;
end;
$$;

revoke all on function public.finish_cloudinary_deletion_jobs(uuid, text[], text[], text)
from public;
grant execute on function public.finish_cloudinary_deletion_jobs(uuid, text[], text[], text)
to service_role;
