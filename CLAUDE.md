# Project

Mineboard is a kanban-style board management app where users create boards, add cards, and attach typed list fields (text, number, date, image, checkbox, tag) to each card.

## Current project context

- What I'm working on: Mineboard
- Goal: Dashboard containing all boards tailored to user preferences — draggable reorder of boards, cards, and lists; realtime sync across sessions; notification/reminder feature.
- Audience: Demo app for job seeking.
- Stack context: Next.js, TailwindCSS, Apollo GraphQL, Supabase, Vitest
- What to avoid: Over-engineering for simple tasks.

Apply this context to every task. When something doesn't fit, flag it before proceeding.

## PROJECT STACK

These facts are always true for this project. Apply them to every session without exception:

- **Data Fetching:** READ operations always use GraphQL via Apollo Client. Types are auto-generated from the Supabase GraphQL API using Codegen — never hand-write query types.
- **Data Mutation:** CREATE and UPDATE use Supabase RPC directly (fewer round trips) — never GraphQL mutations. DELETE uses GraphQL mutations; RLS handles auth via user token and GraphQL supports batch deletes cleanly.
- **Client-Side State:** Apollo Client cache only. Do not introduce another state manager for server data.
- **Next.js Caching:** NEVER cache user-scoped data (session, profile, boards, cards, lists) with Next.js server cache (`cache()`, `unstable_cache`, fetch cache). Reason: cache is shared across users and risks leaking data between sessions.
- **Server Actions vs Route Handlers:** Default to Server Actions for mutations and form handling. Use a Route Handler only when a third-party service requires an HTTP endpoint (e.g. `/api/sign-cloudinary`).
- **Images:** Cloudinary for storage. Store only the `public_id` in the database — never a full URL.
- **Styling:** TailwindCSS only. No inline styles or external CSS files unless unavoidable.
- **Architecture decisions:** For questions involving system architecture, performance tradeoffs, database design, or long-term decisions — work step by step, surface tradeoffs, flag assumptions, then give a recommendation.

If any task conflicts with one of these, flag it before proceeding.

## Stack

- Next.js 16 (App Router, React Server Components)
- React 19, TypeScript 5
- Tailwind CSS 4 (no v3 compatibility layer)
- Supabase (PostgreSQL + Auth)
- Apollo Client 4 + GraphQL (via `@apollo/client-integration-nextjs`)
- Vitest 4 (dual config: browser via Playwright + node)
- Zod 4, RxJS, Cloudinary, Headless UI

## Commands

```
dev:        next dev
build:      next build
test:       npm test  (runs both browser + node configs)
test:browser: vitest --config vitest.config.mts
test:node:  vitest --config vitest.node.config.mts
lint:       eslint
typecheck:  tsc --noEmit
validate:   npm run lint && npm run typecheck
codegen:    graphql-codegen --config codegen.ts --watch
```

## Structure

```
app/           Next.js App Router pages and API routes
components/    React components grouped by feature (Board, Dashboard, global, etc.)
gql/           Apollo client config + GraphQL codegen output (gql/__generated__/)
utils/         Server actions, Supabase client factories, validation, formatting
types/         Shared TypeScript types (app.ts, jsonbSchema.ts)
mocks/         Test stubs for browser and node environments
supabase/      Supabase local config
icons/         SVG icon assets
public/        Static files
reports/       Vitest JUnit output
```

Path alias: `@/*` maps to the project root.

# CUSTOM RULES

- Since this is a demo, always concern about sparingly token consume e.g. when run database testing in the CI, instead use diff that simulate shadow database in the docker, just use migration list to log the remote migration against the local migration in order to save the execution limit of Gitlab CI
- Create separate commits per logical change with prefix "(draft)" unless I explicitly say the feature is done: this prefix prevents CI pipeline from running
- Always import `useFragment` from `@/gql/__generated__` with a renamed alias: `import { useFragment as readFragment } from '@/gql/__generated__'`. Reason: `useFragment` is a graphql-codegen utility function, not a React hook, but ESLint's `react-hooks/rules-of-hooks` treats any "use"-prefixed function as a hook and flags calls inside callbacks or handlers. Using `readFragment` as the alias avoids false positives without suppression comments.
