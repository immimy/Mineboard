# Mineboard Codex Instructions

Mineboard is a kanban-style board management app where users create boards, add cards, define typed list fields for a board, and add list values to each card.

Current product direction: a dashboard containing all boards tailored to user preferences, including draggable reorder of boards, cards, and lists, realtime sync across sessions, and notification/reminder support. This is a demo app for job seeking, so keep solutions simple, visible, and easy to explain (aka avoid over-engineering).

Apply this context to every task. When a request conflicts with these instructions, flag it before proceeding.

## Stack

- Next.js 16 App Router with React 19 and TypeScript 5.
- Tailwind CSS 4 configured in `app/globals.css`; there is no `tailwind.config.js`.
- Apollo Client 4 with Supabase GraphQL and generated GraphQL Code Generator types.
- Supabase PostgreSQL/Auth, RLS, and invoker-security RPCs for create flows.
- Vitest 4 with browser and node configs.
- Zod 4, React Hook Form, Headless UI, React Toastify, Cloudinary/next-cloudinary, Embla Carousel, Day.js, and RxJS.

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Test all: `npm test`
- Browser tests: `npm run test:browser`
- Node tests: `npm run test:node`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Validate: `npm run validate`
- Codegen watch: `npm run codegen`
- Generate Supabase database types:
  `npx supabase gen types typescript --local --schema public > supabase/database.types.ts`

`npm run codegen` is watch-mode. Use it when editing GraphQL operations, then stop it after generated files are updated.

Regenerate `supabase/database.types.ts` after applying a migration locally that changes the database schema or RPC signatures. Commit the migration and regenerated type together; never edit the generated type manually.

## Project Rules

- READ operations use Supabase GraphQL through Apollo Client.
- In Server Actions, use `utils/actions/graphql.ts` `customQuery()` for follow-up GraphQL reads instead of calling an Apollo client directly.
- Types are generated from Supabase GraphQL by GraphQL Code Generator. Never hand-write query result types and never edit `gql/__generated__/` manually.
- CREATE flows currently use Supabase RPCs directly: `create_board`, `create_card`, `create_list_with_values`, and `create_list_fields`.
- DELETE should use GraphQL mutations unless the project intentionally adds an RPC for a multi-row or ordered write.
- UPDATE is expected to use Supabase RPCs for ordered, multi-row, or integrity-sensitive changes.
- Use Apollo Client cache only for server data. Do not add another server-state manager.
- Never cache user-scoped data with Next.js server cache APIs such as `cache()`, `unstable_cache`, or fetch cache. Apollo HTTP links use `fetchOptions: { cache: 'no-store' }`.
- Default to Server Actions for app mutations and form handling.
- Use Route Handlers only when a third-party service needs an HTTP endpoint, such as `/api/sign-cloudinary` or the Supabase OAuth callback.
- Cloudinary stores images. Persist only Cloudinary `public_id` values in list value JSON, never full URLs.
- Keep dialog contexts in `components/Mutation/Context` split into state and actions contexts. Components that only need open/close actions should not subscribe to dialog state such as `isOpen`, because a single state+actions context would re-render every consumer on each toggle. This is most important for repeated board items: `Card` consumes `useUpdateCardDialogActions()`, so opening one update-card dialog would otherwise re-render every rendered card; `List` consumes `useUpdateListDialogActions()`, so opening one update-list dialog would otherwise re-render every rendered list.
- Do not deploy, push, run migrations, alter schema, add dependencies, or modify CI/CD without explicit in-session confirmation.

## Current App Flow

- `/` is the public landing/home page.
- `/dashboard` is protected and renders `BoardsContainer`, which queries the current user's boards with `AllBoards`.
- `/dashboard/[id]` renders `BoardContainer`, which queries the board, its list fields, and cards in `SingleBoard`.
- `BoardContext` owns the active board id, list field fragments, and Add List Field/Add Card/Add List dialog state.
- Sidebar board navigation uses the dashboard board query and supports inline board creation with optimistic pending rows.
- Add board/card/list/list-field flows create data through Server Actions, fetch the created record through GraphQL, and then update Apollo cache on the client.
- Auth uses Supabase Google OAuth PKCE. `/api/auth` exchanges the code for a session and redirects to a relative `next` path when provided.
- Route protection lives in `utils/database/proxy.ts` `updateSession()`. Keep `supabase.auth.getClaims()` there; do not replace it with `getUser()`.
- `/api/sign-cloudinary` checks `getClaims()` before signing Cloudinary uploads.

## Data Model

- Main tables are `boards`, `cards`, `lists`, `list_fields`, and `list_values`.
- RLS is enabled on all domain tables. Current RPCs use `security invoker`, so RLS still applies.
- Cards and lists use integer `position` fields. New cards/lists are appended using `max(position) + 1`.
- `list_fields.type` is a Supabase enum generated as `Field_Type`.
- `list_fields.config` and `list_values.value` are JSONB. App-side shapes live in `types/jsonbSchema.ts`.
- Supported field/list value variants are text, number, date, image, checkbox, and tag.
- Date inputs are converted from local time to UTC in validation using the submitted timezone offset.
- Empty list values are filtered before calling `create_list_with_values`, so empty fields do not create `list_values` rows.
- `ColorPalette` is the numeric card/tag palette `1` through `9`, mirrored by CSS tokens and database constraints.

## GraphQL And Cache

- Define GraphQL operations with `graphql()` from `@/gql/__generated__`.
- Prefer colocated fragments for components that receive GraphQL data. Accept `FragmentType<typeof Fragment>` props when practical.
- Prefer importing fragment unmasking as `useFragment as readFragment` when touching code:
  `import { useFragment as readFragment } from '@/gql/__generated__'`.
- Existing files may still import `useFragment` directly. If you modify those files, clean that up only when it is scoped and low-risk.
- `gql/apollo/ApolloClient.ts` registers the server Apollo client. Do not instantiate Apollo clients at module scope in Server Actions or Route Handlers. Create a fresh server client per request.
- `components/global/ApolloWrapper.tsx` creates the browser Apollo client.
- After create mutations, current UI updates Apollo cache manually with `cache.updateQuery`, `cache.writeFragment`, or `cache.modify`.
- Codegen maps Supabase GraphQL `JSON` to `string`; validate or narrow JSONB shapes at app boundaries instead of assuming generated types are precise.

## UI And Styling

- Use Tailwind CSS only. Avoid inline styles or external CSS unless unavoidable.
- Tokens, dark mode, custom variants, and safelisted dynamic classes live in `app/globals.css`.
- Dynamic card/tag classes such as `bg-card-${color}` require matching `@source inline(...)` safelist entries in `app/globals.css`.
- Prefer canonical Tailwind data variants like `data-checked:`, `group-data-checked:`, `data-selected:`, and `data-focus:` over arbitrary variants when the shorthand available.
- Build components on Headless UI primitives before falling back to native elements.
- Build reusable form inputs on Headless UI primitives such as `Field`, `Label`, `Description`, `Input`, `RadioGroup`, and `Radio`.
- When creating a new Headless UI component, check nearby components for repeated className patterns. Extract a small template component in the same file only when reuse is clear.
- Prefer data-attribute variants over render-prop className functions for Headless UI state styling.
- The dark theme is class-based via the `dark` class on `<html>`, toggled by `ThemeToggleButton` and persisted in localStorage as `prefers-scheme`.

## Structure

- `app/`: Next.js App Router pages, layouts, global CSS, providers, API routes, and `global-error`.
- `components/BoardPage`: single-board query rendering, board/card/list display, board context, and action menu.
- `components/DashboardPage`: all-boards query rendering and dashboard board items.
- `components/Mutation`: board/card/list creation UI and field/list input components.
- `components/ListField`: read-only renderers for typed list values.
- `components/Navbar` and `components/Sidebar`: navigation, auth controls, theme toggle, and board navigation.
- `components/form` and `components/global`: reusable form and app UI primitives.
- `gql/`: Apollo client setup and generated GraphQL output.
- `utils/actions`: Server Actions for auth, board/card/list writes, GraphQL follow-up queries, and action error formatting.
- `utils/database`: Supabase config plus server, browser, and proxy clients.
- `utils/validation`: Zod schemas and list-value formatting helpers.
- `types/`: shared app and JSONB schema types.
- `mocks/`: browser and node test stubs for Next.js, Supabase, helpers, and toast behavior.
- `supabase/`: local Supabase config, seed data, migrations, and migration notes.
- `icons/`: app icon components.
- `public/`: static assets.
- `reports/`: Vitest JUnit output.

Path alias: `@/*` maps to the project root.

## Testing

- For feature work, add and run client/browser tests only. Do not add or run node tests unless explicitly requested.
- Browser tests use `vitest.config.mts`, Chromium via Playwright, and `vitest.setup.ts`.
- Node tests use `vitest.node.config.mts`, `environment: 'node'`, and `vitest.node.setup.ts`.
- Name node-only tests `*.node.test.ts`; browser config excludes those files.
- Tests output JUnit reports to `reports/`.
- Check `mocks/` before adding new stubs. Browser and node configs alias Supabase and Next.js modules to local mocks.
- Existing coverage focuses on dashboard/board states, add board/card/list/list-field flows, auth callback behavior, route protection, sidebar navigation, navbar auth/theme controls, and form edge cases.
- Prefer behavior/result assertions for create flows over direct Apollo cache inspection unless the cache behavior is the feature being tested.
- When adding or updating tests, inspect only nearby tests and run the smallest relevant test command; do not run the full test suite unless needed.

## Gotchas

- `ERRORS.md` records a Headless UI/React `flushSync` warning fixed by keeping the Add Card color `RadioGroup` controlled. Check it before changing dialog form state.
- PowerShell treats paths like `app/dashboard/[id]/page.tsx` as wildcard patterns; use `-LiteralPath` when reading or editing bracketed route files.
- `createClient()` from `utils/database/serverClient.ts` must be called per request. Do not place Supabase clients in module-level state.
- `updateSession()` warns not to run code between `createServerClient()` and `supabase.auth.getClaims()`; preserve that ordering.
- `list_fields.name` was removed by migration. Do not rely on list field names in new code.
- `.env.local` exists for local development and must never be committed.

## Collaboration Notes

- For architecture, performance, database design, or long-term tradeoffs, work step by step, surface assumptions, and recommend a direction.
- Keep changes scoped to the requested area and mention unrelated improvements separately.
- Create separate commits per logical change with suffix `(draft)` unless the user explicitly says the feature is done.
