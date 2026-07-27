# Cloudinary Deletion Queue Cleanup

Scheduled Edge Function that processes image deletion jobs from
`private.cloudinary_deletion_jobs`.

## Behavior

1. Claim a bounded batch through `claim_cloudinary_deletion_jobs`.
2. Delete the claimed image public IDs with Cloudinary's bulk Admin API.
3. Treat Cloudinary `deleted` and `not_found` results as completed jobs.
4. Remove completed jobs and release failed jobs through
   `finish_cloudinary_deletion_jobs`.
5. Leave failures eligible for retry on the next scheduled run.

Claims use a short lease and `FOR UPDATE SKIP LOCKED`, so concurrent function
invocations do not process the same available jobs. If a worker stops after
Cloudinary succeeds but before database completion, the lease eventually
expires and the idempotent retry completes as `not_found`.

## Configuration

Required Edge Function environment variables:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_CLEANUP_SCOPE`: must be `development` or `production`.

Optional settings:

- `CLOUDINARY_DELETION_BATCH_SIZE`: defaults to `50`, maximum `100`.
- `CLOUDINARY_DELETION_CLAIM_TTL_SECONDS`: defaults to `300`, constrained to
  `60`–`900` seconds.
