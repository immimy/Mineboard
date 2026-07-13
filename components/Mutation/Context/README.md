# Dialog Context Notes

Dialog contexts in this folder are intentionally split into state and actions contexts.

Components that only need to open or close a dialog should consume the actions context only. They should not subscribe to dialog state such as `isOpen`.

If each dialog used a single combined state+actions context, every context
consumer would re-render whenever the dialog toggles. That would include
components that only need a stable action function.

The most important examples are repeated board items:

- `Card` consumes `useUpdateCardDialogActions()`. With a single combined
  update-card context, opening one card update dialog would re-render every
  rendered card.
- `List` consumes `useUpdateListDialogActions()`. With a single combined
  update-list context, opening one list update dialog would re-render every
  rendered list.

The split is not required for correctness, but it keeps dialog APIs clearer and
prevents avoidable board UI renders as the number of cards and lists grows.
