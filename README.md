# Mineboard

Mineboard is a kanban-style workspace where users create boards, add cards, define typed fields for a board, and attach structured values to each card.

The project is designed with production-minded foundations: type-safe GraphQL operations, user-scoped authorization, validated server actions, deliberate Apollo cache updates, broad browser/server testing, and a GitLab delivery pipeline.

## Current capabilities

- Google authentication through Supabase OAuth and PKCE.
- Protected dashboard and board routes.
- Create and update boards and board titles.
- Create and update cards and lists.
- Define reusable list fields for a board.
- Text, number, date, image, checkbox, and tag field values.
- Apollo Client cache updates after successful mutations.
- Image uploads through Cloudinary with cleanup workflows in active development.
- Class-based light and dark themes.

## Notable engineering decisions

### Type-safe GraphQL reads

Supabase GraphQL is consumed through Apollo Client. GraphQL Code Generator creates typed operations and fragment helpers from colocated queries, so components work with generated contracts instead of handwritten response types.

### Purpose-specific writes

Simple reads use GraphQL. Create and integrity-sensitive multi-row flows use Supabase RPCs with invoker security, allowing PostgreSQL transactions and row-level security to protect the complete operation.

### Apollo cache ownership

Apollo Client is the only server-state manager. After a server action returns the created or updated record, client components update normalized cache entries or query results directly rather than forcing a full route refresh.

### Structured custom fields

Boards define field metadata while cards store matching JSONB values. Zod validates and narrows text, number, date, image, checkbox, and tag variants at application boundaries.

### Testing strategy

Vitest runs two suites:

- Browser tests render React components in Chromium through Playwright.
- Node tests cover server-only behavior such as authentication callbacks and route protection.

The current suite covers dashboard and board states, create/update flows, form edge cases, cache behavior, navigation, authentication, and theme controls.

### Delivery pipeline

GitLab CI builds the application with Vercel tooling, runs browser and node tests, publishes JUnit reports, and prepares preview or production deployments based on the branch. Scheduled jobs rebuild the shared CI image. Deployment remains an explicit project-owner action.

## Stack

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 and Headless UI
- Apollo Client and Supabase GraphQL
- GraphQL Code Generator
- Supabase PostgreSQL, Auth, RLS, and RPCs
- React Hook Form and Zod
- Vitest Browser Mode and Playwright
- Cloudinary
- GitLab CI and Vercel

## Project structure

```text
app/          App Router pages, layouts, providers, and route handlers
components/   Board, dashboard, mutation, navigation, and form UI
gql/          Apollo configuration and generated GraphQL output
supabase/     Local configuration, migrations, functions, and seed data
utils/        Server actions, database clients, validation, and formatting
mocks/        Browser and node test doubles
types/        Shared application and JSONB types
```

## Run locally

Install dependencies and start the local Supabase services required by the project, then run Next.js:

```bash
npm install
npm run dev
```

Database migrations and generated types must stay paired, and migrations should only be applied to a development project you control.

Useful commands:

```bash
npm run validate
npm test
npm run test:browser
npm run test:node
npm run build
npx supabase gen types typescript --local --schema public > supabase/database.types.ts
```

`npm run codegen` is watch mode and requires a reachable Supabase GraphQL schema.

## Authentication workflow

1. The user selects **Sign in with Google**.
2. A server action calls `supabase.auth.signInWithOAuth()`.
3. Supabase returns the Google OAuth URL and redirects the browser.
4. Google returns the authorization code to `/api/auth`.
5. The route handler exchanges the code for a session using PKCE.
6. Supabase stores the session in cookies and redirects to `/dashboard`.
7. The project proxy refreshes and verifies the session on protected requests.

## Theme color maintenance

To add a predefined card/tag palette:

1. Add matching `card` and `card-light` tokens to `@theme inline`, `:root`, and `.dark` in `app/globals.css`.
2. Add the value to the `ColorPalette` type and `colorOptions` in `types/schema.ts`.
3. Update the matching database constraint, `color_palette`, or type through a migration.
4. Regenerate database types after applying the migration locally.

Dynamic classes must also be included in the safelist with `@source inline(...)` in `app/globals.css` so Tailwind emits them in the final bundle.
