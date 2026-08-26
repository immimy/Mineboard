# Drag-and-drop browser test suite

These tests render the real board drag-and-drop components in Chromium. Shared board data lives in `testMocks.ts`, while rendering, locators, drag gestures, timer control, and layout assertions live in `testUtils.tsx`.

| Test file | Behavior covered | Main save expectation |
| --- | --- | --- |
| `InitialLayout.test.tsx` | Renders cards and lists in server order. | No mutation is performed. |
| `CardReordering.test.tsx` | Moves a card from its drag handle. | Saves the resulting full layout exactly once. |
| `ListReordering.test.tsx` | Reorders lists within one card. | Saves the resulting full layout exactly once. |
| `EmptyCardDrop.test.tsx` | Moves a list into an empty card. | Saves both affected card groups exactly once. |
| `CrossCardListMove.test.tsx` | Moves a list into a non-empty card. | Saves both affected card groups exactly once. |
| `InvalidListDrop.test.tsx` | Drops a list outside every valid card or list target. | Restores the original layout and does not save. |
| `InvalidCardDrop.test.tsx` | Drops a card outside a valid card target. | Restores the original layout and does not save. |
| `DragHandleActivation.test.tsx` | Attempts to drag a list outside its configured handle. | Does not reorder or save. |
| `CardNoOpDrop.test.tsx` | Drops a card back at its current position. | Does not save an unchanged layout. |
| `ListNoOpDrop.test.tsx` | Drops a list back at its current position. | Does not save an unchanged layout. |
| `KeyboardReordering.test.tsx` | Moves a card with Space and an arrow key through `KeyboardSensor`. | Saves the keyboard-produced layout exactly once. |
| `SaveDebounce.test.tsx` | Performs consecutive drags before the debounce expires. | Coalesces them into one call containing only the latest layout. |
| `SaveQueue.test.tsx` | Drags again while an earlier save request is still running. | Runs one request at a time, then saves the queued latest layout. |
| `LatestSavedRollback.test.tsx` | Fails a save after an earlier layout saved successfully. | Restores the latest successfully saved layout. |
| `StaleSaveFailure.test.tsx` | An older in-flight save fails after a newer layout was requested. | Keeps the newer layout and does not show the rollback toast. |

## Save timing distinction

| Timing | Expected calls |
| --- | --- |
| Multiple drags occur within the 1-second debounce window. | One call with the latest complete layout. |
| A second drag occurs after the first request has started. | Two sequential calls; the second waits for the first to finish. |
