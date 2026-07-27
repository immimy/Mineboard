# Cloudinary Image Deletion Triggers V2

## Migration Purpose

`list_values.value` stores Cloudinary image `public_id` strings for image list
fields. When an update or delete removes a stored reference, the database queues
that public ID in `private.cloudinary_deletion_jobs`. A separate worker can then
delete the Cloudinary asset after the database transaction succeeds.

The migration keeps cleanup transactional: if the original update or delete is
rolled back, its queued deletion jobs are rolled back too. Database triggers
only create jobs; they never call Cloudinary directly.

## Decision

Use statement-level triggers for updates and deletes on `public.list_values`,
while retaining the existing row-level `BEFORE DELETE` trigger on
`public.list_fields`.

### Why `list_values` Uses Statement-Level Triggers

The `update_list` RPC updates multiple list values with one SQL statement. A
row-level trigger would execute once for every updated or deleted value and
repeat field-type checks and queue-helper calls.

A statement-level trigger executes once for the SQL statement. PostgreSQL
transition tables provide all affected rows, so the trigger function can:

1. filter the batch to image list fields;
2. collect all removed public IDs with one set-based query;
3. call the queue helper once.

This cost scales with affected rows rather than adding a separate trigger call
for every list value. New non-image field types require no additional trigger
logic because the query continues to filter on `list_field.type = 'image'`.

### Why The Update Trigger Is `AFTER UPDATE`

PostgreSQL exposes old and new transition tables only to `AFTER` triggers. The
trigger compares each stored image array with its replacement:

```text
removed public IDs = old image IDs - new image IDs
```

Example:

```text
Old value: ["image-a", "image-b"]
New value: ["image-b", "image-c"]
Queued:    ["image-a"]
```

Although the trigger runs after the row update, it remains inside the same
transaction. A queueing error therefore rolls back the update.

PostgreSQL does not allow an `UPDATE OF value` column list when a trigger uses
transition tables. The trigger consequently runs for every update statement on
`list_values`, then excludes unchanged values with
`old_value.value IS DISTINCT FROM new_value.value`.

### Why `list_fields` Remains A Row-Level `BEFORE DELETE` Trigger

Deleting a list field cascades to its dependent list values. A statement-level
`BEFORE DELETE` trigger cannot access the statement's targeted row set, while an
`AFTER DELETE` trigger runs after the dependent values are gone.

The existing row-level field trigger receives each deleted field as `OLD` and
queues its image values before the cascade. It is therefore required for field
deletion and for board cascades where list fields disappear.

## Delete Coverage

The migration replaces the row-level `list_values` delete trigger with an
`AFTER DELETE` statement trigger using `deleted_list_values` as its old
transition table.

- Direct list-value deletions are processed as one batch.
- Deleting or clearing list/card data is processed through the list-value
  trigger while its list field still exists.
- Deleting an image list field is handled by the existing field trigger before
  its cascade.
- Board cascades are safe regardless of which foreign-key path reaches a list
  value first: the list-value trigger can queue while the field exists, or the
  field trigger queues before the field disappears.

Overlapping queue attempts are harmless because
`private.cloudinary_deletion_jobs.public_id` is unique and the queue helper uses
`ON CONFLICT DO NOTHING`.

## JSON Safety

Both statement trigger functions treat non-array JSON values as empty arrays
and extract only JSON strings. The shared queue helper also ignores nulls,
blank strings, and HTTP/HTTPS URLs, preventing seed or development URLs from
becoming Cloudinary deletion jobs.

## Trigger Summary

```text
UPDATE public.list_values
  -> AFTER UPDATE, FOR EACH STATEMENT
  -> compare old and new transition tables
  -> queue removed image public IDs

DELETE public.list_values
  -> AFTER DELETE, FOR EACH STATEMENT
  -> inspect deleted-values transition table
  -> queue image public IDs in one batch

DELETE public.list_fields
  -> BEFORE DELETE, FOR EACH ROW (kept from the previous migration)
  -> queue dependent image public IDs before cascade
```
