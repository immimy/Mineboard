# Cloudinary Unsaved Cleanup

Scheduled Edge Function that processes stale Cloudinary images tagged
`unsaved`.

## Behavior

1. Search for `unsaved` images older than the configured threshold:
   - `development` processes only assets tagged `dev`;
   - `production` excludes assets tagged `dev`.
2. Check which public IDs are referenced in PostgreSQL.
3. Remove the `unsaved` tag from referenced images.
4. Delete unreferenced images.

If the reference check fails, no Cloudinary images are modified. Failed
Cloudinary operations remain discoverable by the next scheduled run.

## Configuration

Required Edge Function environment variables:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_CLEANUP_SCOPE`: must be `development` or `production`. A missing
  or invalid value stops the worker before it queries Cloudinary.

Optional settings:

- `CLOUDINARY_UNSAVED_MAX_AGE_HOURS`: defaults to `24`, minimum `24`.
- `CLOUDINARY_UNSAVED_BATCH_SIZE`: defaults to `50`, maximum `100`.
