-- ============================================================
-- Schedule both Cloudinary cleanup workers for 10:00 P.M.
-- Asia/Bangkok (15:00 UTC) every day.
-- ============================================================

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'cloudinary-image-cleanup-daily',
  '0 15 * * *',
  $cron$
    do $job$
    declare
      v_project_url text;
      v_image_cleanup_key text;
    begin
      select decrypted_secret
      into v_project_url
      from vault.decrypted_secrets
      where name = 'project_url';

      select decrypted_secret
      into v_image_cleanup_key
      from vault.decrypted_secrets
      where name = 'image_cleanup_secret_key';

      if v_project_url is null then
        raise exception 'Vault secret "project_url" is required';
      end if;

      if v_image_cleanup_key is null then
        raise exception 'Vault secret "image_cleanup_secret_key" is required';
      end if;

      perform net.http_post(
        url => rtrim(v_project_url, '/')
          || '/functions/v1/cloudinary-unsaved-cleanup',
        headers => jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', v_image_cleanup_key
        ),
        body => '{}'::jsonb,
        timeout_milliseconds => 10000
      );

      perform net.http_post(
        url => rtrim(v_project_url, '/')
          || '/functions/v1/cloudinary-deletion-queue-cleanup',
        headers => jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', v_image_cleanup_key
        ),
        body => '{}'::jsonb,
        timeout_milliseconds => 10000
      );
    end;
    $job$;
  $cron$
);
