# Referenced Cloudinary Image Lookup

## Migration Purpose

`get_referenced_image_public_ids` classifies a bounded batch of Cloudinary
`public_id` candidates by returning only IDs that are still stored by image
`list_values`.

- The authenticated application uses the lookup before cleaning uploads from a
  cancelled dialog.
- The scheduled stale-upload worker uses the same lookup with
  the service role before it mutates old assets tagged `unsaved`.

## Cleanup Decisions

```text
Cancelled dialog candidate
  -> referenced: remove the unsaved tag
  -> unreferenced: delete the Cloudinary asset

Stale unsaved candidate
  -> referenced: repair by removing the unsaved tag
  -> unreferenced: delete the Cloudinary asset
```

- If the database lookup fails, callers must delete nothing and retry later.
