# Error Notes

## React `flushSync` Warning When Closing Add Card Dialog

- Symptom: submitting the Add Card form logs `flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.`
- Location: `components/Mutation/Card/Create/AddCardDialog.tsx`.
- Cause: `createCard()` succeeds, then the form action updates Apollo cache and closes the Headless UI `Dialog` while React is still completing the `useActionState` submit/render lifecycle.
- Why it happens here: the card dialog contains Headless UI form controls such as the color `RadioGroup`. Headless UI can call internal `flushSync` for uncontrolled component/focus work. If that happens during React's current render/effect work, React warns and treats it as an invalid synchronous flush.
- Failed/weak fix: deferring `closeAddCard()` with `setTimeout()` can reduce the timing issue, but it is not guaranteed. The warning can still appear occasionally because the underlying uncontrolled Headless UI `RadioGroup` may still call internal `flushSync` during React's submit/render work.
- Chosen fix: make the color `RadioGroup` controlled instead of uncontrolled.
- Reason: a controlled `RadioGroup` avoids Headless UI's uncontrolled internal state update path, which is the path that can call `flushSync`.

## Dnd-kit Keyboard Reorder Browser Test

- Symptom: `{Space}{ArrowRight}{Space}` left Card A in its original position instead of moving it after Cards B.
- Location: `components/BoardPage/__tests__/DragDrop/KeyboardReordering.test.tsx`.
- Cause: dnd-kit's keyboard sensor selects sortable targets spatially in the arrow's direction; it does not treat arrow presses as moves through the `cardIds` array. Below the 768px `md` breakpoint, the cards form one vertical column, so Cards B and C are below Card A rather than to its right.
- Chosen fix: choose `ArrowDown` below Tailwind's 768px `md` breakpoint and `ArrowRight` at or above it, then move Card A one adjacent position with `{Space}{direction}{Space}`.
