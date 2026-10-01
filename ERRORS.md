# Error Notes

## Board Feature Test Refresh (2026-09-24)

- Cause: test renderers lacked `LayoutMutationSyncProvider`, and drag-save expectations used the previous debounce and notification messages.
- Fix: include the real provider in board, drag, and demo renderers; reuse the shared renderer for AddListFieldsFeature; match the 1500 ms debounce and separate failure/recovery notifications.
- Date input: use `fill('2026-12-24')` instead of typing `12242026` so AddListFeature does not depend on the browser's date format.
- Verification (2026-09-28): the user confirms all tests pass locally. Typecheck and scoped ESLint passed during the refresh. No further test changes are planned.

## Drag-and-Drop Browser Test Setup (2026-09-16)

- Initial issue: every drag-and-drop test failed with Apollo's missing-client error after `BoardDragDropArea` started using `useApolloClient()`. Wrap the shared renderer in `MockedProvider` to provide the required client.
- Chosen approach: mock `CollapsibleCard` with the shared `ExpandedCardMock` in `testMocks.ts`, registering `vi.mock()` directly in each drag-and-drop test entry file. Always expose the card's list content while keeping the real sortable cards and lists.
- Reason: these tests were originally written for cards that could not collapse. Keeping cards expanded lets the suite exercise sorting and saving independently of collapse, overflow measurement, and hover-to-expand behavior. This suite does not verify those expansion behaviors.
- Preserve the original drag gestures and exact order/save assertions alongside the expansion mock.

## Apollo Connection Modifier Types (2026-09-15)

- Location: `utils/dragdrop/cache.ts`, when updating nested list membership.
- Failed approaches: typing the modifier input as a plain connection excluded Apollo's possible `Reference`; leaving it inferred made spreading the value fail; supplying the generated card result type rejected normalized references inside connection edges.
- Cause: generated query results describe expanded records, while cache modifiers receive stored objects and references.
- Chosen fix: type the connection input as `StoreObject | Reference | null`, narrow references with `isReference`, and create list references with `toReference`. Keep generated types for query reads.
- Verification: project typecheck passed.

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

## Collapsed Card Does Not Expand During Cross-Card Drag

- Symptom: hovering a list over a collapsed card does not open it after the 150ms delay.
- Location: `components/BoardPage/CardsGrid.tsx`.
- Cause: cross-card layout updates remount `SortableList` under its new card. With the installed dnd-kit 0.5.0, the new registration resets `source.initialGroup` to the destination. Comparing the hovered card against that value turns off `isListDragOver` and cancels the disclosure timer.
- Failed approach: relying on `useDragOperation()` plus `source.initialGroup` to identify the original card throughout the drag. Reading reactive source/target instances does not preserve the original group across remounts.
- Chosen fix: capture `source.group` once in `useDragDropMonitor`'s `onDragStart` handler and keep that origin in grid state for the duration of the drag. Compare hover targets against this snapshot.

## Browser Tests Cannot Bind the Default Port (2026-09-10)

- Symptoms: Vite initially failed with `spawn EPERM` inside the sandbox. Outside the sandbox, browser tests failed before collecting tests with `listen EACCES: permission denied ::1:63315`.
- Failed approaches: CLI `--browser.api.host` / `--browser.api.port` overrides, including a separate `--api` override, still left the browser server using port 63315. The installed browser runner reads `viteConfig.test.browser` when starting its separate Vite server. Passing a second `--config` through `npm run test:browser` also failed because the npm script already supplies that option.
- Working approach: create a temporary `.mts` config outside the project that imports and spreads the existing Vitest config and its test/browser options, then sets `test.browser.headless: true` and `test.browser.api: { host: '127.0.0.1', port: 5175 }`. Run the installed CLI directly with `node node_modules/vitest/vitest.mjs --config <temporary-config-path> --run <test-files> --reporter=default`, outside the sandbox so Vite can start subprocesses. This preserves project configuration and avoids rewriting JUnit reports.
- Verification: all six focused deletion/subscription/card-reorder/cross-card-move tests passed using this approach.
- Separate follow-up: Vitest 4.1.11 reports that the installed browser package is 4.1.10. This version mismatch was left unchanged; align versions with user approval before relying on broader test results.
- Permanent fix (2026-09-16): updated `@vitest/browser-playwright` to exactly `4.1.11` to match Vitest and regenerated the npm lockfile. Windows IPv4 and IPv6 excluded port ranges included `63251–63350`, confirming that the default port `63315` was reserved. Set `test.browser.api` to `{ host: '127.0.0.1', port: 5175 }` in `vitest.config.mts`; a version update alone would not fix the reserved port.
- Verification: `npm ls` reports matching Vitest packages without invalid peers; all seven existing theme-toggle browser tests pass with the regular project config, without the mixed-version warning or port error. Project typecheck and lint of `vitest.config.mts` pass.
