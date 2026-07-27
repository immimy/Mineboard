# Image Upload Session Hook

## Scope

`useImageUploadSession` is currently consumed by `AddListDialog` and
`UpdateListDialog`.

The hook performs client-side tracking and classification only.

## Session Reference

- The hook stores a private `Set<string>` inside `useRef`.
- The reference persists across re-renders while the dialog session is open.
- It collects only images newly uploaded during that session.
- Stored images loaded from the database are never added to this set.
- A `Set` prevents the same public ID from being tracked more than once.
- The reference is cleared when the dialog session is completed or discarded.

## Hook Operations

- `trackUpload(publicId)` records a newly uploaded public ID.
- `completeSession(form)` compares all session uploads with all image IDs still
  present across the submitted form. It returns `savedIds` and `discardedIds`,
  then clears the session reference.
- `discardSession()` returns every tracked upload as discarded, then clears the
  session reference.

## Summary

- `UpdateListDialog` can contain persisted images loaded from the database and
  new images uploaded during the open dialog.
- `AddListDialog` contains only new uploads because it creates a new list.
- Removing a new image does not request deletion immediately. It changes only the
  form, while the session keeps the ID for the final Cancel or Save batch.

| Case                       | Session         | Form / Database       | Result                  |
| -------------------------- | --------------- | --------------------- | ----------------------- |
| Persisted kept             | Not tracked     | Present / present     | Not classified          |
| Persisted removed + cancel | Not tracked     | Removed / unchanged   | No trigger              |
| Persisted removed + save   | Not tracked     | Removed / removed     | Trigger queues deletion |
| New upload kept + save     | Tracked         | Present / stored      | `savedIds`              |
| New upload removed + save  | Tracked         | Removed / absent      | `discardedIds`          |
| Dialog cancelled           | All new tracked | Discarded / unchanged | All new discarded       |
| Submission fails           | Tracking kept   | Retained / unchanged  | Not classified          |

### Cleanup Responsibility

| Image                 | Cleanup path     | When                        |
| --------------------- | ---------------- | --------------------------- |
| Persisted             | Database trigger | Successful update or delete |
| New + cancelled       | Client -> server | Final dialog cancellation   |
| New + successful save | Client -> server | Successful database save    |

- Cancelled-dialog cleanup checks database references because a preceding save
  may have committed even if its client response or cache update failed.
- Successful-save cleanup trusts the hook's saved/discarded classification.
- Direct server cleanup verifies Cloudinary `owner_id` context before it removes
  tags or deletes assets. Failed work retains `unsaved` for scheduled cleanup.
