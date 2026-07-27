# Schedule Cloudinary Cleanup

The migration creates one `pg_cron` job named
`cloudinary-image-cleanup-daily`. It runs every day at 10:00 P.M.
Asia/Bangkok (`15:00 UTC`) and queues `POST` requests for:

- `cloudinary-unsaved-cleanup`
- `cloudinary-deletion-queue-cleanup`

## Vault setup

In production, the Edge Functions authenticate requests with the named Supabase
secret API key `image_cleanup`. Local functions use the CLI's auto-provisioned
`default` secret API key. In both environments, the cron job reads a copy of
the applicable API key from the Vault entry `image_cleanup_secret_key`.

Set up both `image_cleanup_secret_key` and `project_url` before the first
scheduled run. Use different values in the local and production Vaults. Never
put a real key in a migration or another committed file.

### Production

Use the Supabase Dashboard instead of committed SQL:

1. Open the production project.
2. Open **Database > Vault**.
3. Add `image_cleanup_secret_key` with the production `image_cleanup` secret
   API key as its value.
4. Add `project_url` with
   `https://<production-project-ref>.supabase.co` as its value.

### Local development

Use the local Supabase Studio SQL Editor. Store the local secret key:

```sql
select vault.create_secret(
  '<local secret API key>',
  'image_cleanup_secret_key',
  'Authenticates local scheduled image cleanup functions'
);

select vault.create_secret(
  'http://api.supabase.internal:8000',
  'project_url',
  'Local API URL used by scheduled Edge Function calls'
);
```

Verify that the entries and schedule exist without reading decrypted values:

```sql
select name, description
from vault.secrets
where name in ('image_cleanup_secret_key', 'project_url');

select jobid, jobname, schedule, active
from cron.job
where jobname = 'cloudinary-image-cleanup-daily';
```
