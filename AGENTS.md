# Mineboard Codex Instructions

Mineboard is a kanban-style board management app where users create boards, add cards, and attach typed list fields to each card.

Current goal: a dashboard containing all boards tailored to user preferences, including draggable reorder of boards, cards, and lists, realtime sync across sessions, and notification/reminder support. This is a demo app for job seeking, so keep solutions simple and avoid over-engineering.

Apply this context to every task. When a request conflicts with these instructions, flag it before proceeding.

## Stack

- Next.js 16 App Router, React 19, TypeScript 5
- Tailwind CSS 4, configured in `app/globals.css`
- Apollo Client 4 with Supabase GraphQL and generated types
- Supabase PostgreSQL/Auth, RPC for selected writes
- Vitest 4 with browser and node configs
- Zod 4, RxJS, Cloudinary, Headless UI

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Test all: `npm test`
- Browser tests: `npm run test:browser`
- Node tests: `npm run test:node`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Validate: `npm run validate`
- Codegen: `npm run codegen`

## Project Rules

- READ operations always use GraphQL via Apollo Client.
- Types are generated from Supabase GraphQL by GraphQL Code Generator. Never hand-write query types and never edit `gql/__generated__/` manually.
- CREATE and UPDATE use Supabase RPC directly.
- DELETE uses GraphQL mutations.
- Use Apollo Client cache only for server data. Do not add another server-state manager.
- Never cache user-scoped data with Next.js server cache APIs such as `cache()`, `unstable_cache`, or fetch cache.
- Default to Server Actions for mutations and form handling.
- Use Route Handlers only when a third-party service needs an HTTP endpoint, such as `/api/sign-cloudinary`.
- Cloudinary stores images. Persist only the `public_id`, never the full URL.
- Use TailwindCSS only. Avoid inline styles or external CSS unless unavoidable.
- Prefer canonical Tailwind data variants like `data-checked:` and `group-data-checked:` over arbitrary variants like `data-[checked]:` when the shorthand exists.
- Build components on top of Headless UI primitives before falling back to native elements.
- Build reusable form inputs on top of Headless UI primitives such as `Field`, `Label`, `Description`, `Input`, `RadioGroup`, and `Radio` before falling back to native elements.
- For architecture, performance, database design, or long-term tradeoffs, work step by step, surface assumptions, and recommend a direction.
- Create separate commits per logical change with suffix `(draft)` unless the user explicitly says the feature is done.
- Always import `useFragment` from `@/gql/__generated__` with a renamed alias:
  `import { useFragment as readFragment } from '@/gql/__generated__'`.

## Structure

- `app/`: Next.js App Router pages and API routes
- `components/`: React components grouped by feature
- `gql/`: Apollo config and generated GraphQL output
- `utils/`: server actions, Supabase clients, validation, formatting
- `types/`: shared TypeScript types
- `mocks/`: browser and node test stubs
- `supabase/`: Supabase local config
- `icons/`: SVG icon assets
- `public/`: static files
- `reports/`: Vitest JUnit output

Path alias: `@/*` maps to the project root.

## Domain Details

All database reads go through the Supabase GraphQL endpoint. Use `utils/actions/graphql.ts` `customQuery()` in actions instead of calling the Apollo client directly. Do not instantiate Apollo clients at module scope in server actions or route handlers.

Google OAuth uses Supabase PKCE. Route protection lives in `utils/database/proxy.ts` `updateSession()`, which uses `supabase.auth.getClaims()`. Do not replace it with `getUser()` there.

Supabase clients are created through `utils/database/serverClient.ts` and `utils/database/browserClient.ts`. Create a fresh server client per request.

List fields store JSONB shapes defined in `types/jsonbSchema.ts`. `ListField` covers text, number, date, image, checkbox, and tag variants.

Components should define GraphQL fragments with `graphql()` and accept `FragmentType<typeof Fragment>` props. Unwrap fragments with the aliased `readFragment`.

Tailwind v4 has no `tailwind.config.js`. Tokens, custom variants, utilities, and safelisted dynamic classes are in `app/globals.css`.

Tests use two Vitest configs. Name node-only tests `*.node.test.ts`; everything else runs in the browser config. Check `mocks/` before adding new stubs.
