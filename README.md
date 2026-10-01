# Mineboard

Mineboard is a kanban-style board app. Each board has cards and a set of reusable, typed fields; each card contains lists whose values follow those fields. The public home page shows a read-only demo workspace, while signed-in users manage their own boards in the dashboard.

## What works today

- Sign in with Google through Supabase Auth and PKCE; dashboard and board routes are protected.
- Create, rename, and delete boards. Create, edit, and delete cards and lists, including selecting multiple cards for deletion.
- Define and edit a board's fields, then enter text, number, date, image, checkbox, and tag values in its lists.
- Reorder cards and lists with pointer or keyboard controls, and move lists between cards. Layout changes are saved to PostgreSQL.
- Upload images to Cloudinary. The app stores their `public_id` values; scheduled cleanup functions handle unused uploads and images queued for deletion.
- Switch between light and dark themes.

## How it is built

- **Frontend:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, and Headless UI.
- **Data:** Supabase PostgreSQL and Auth, row-level security, Supabase GraphQL, Apollo Client 4, and generated GraphQL types.
- **Forms and media:** React Hook Form, Zod 4, Cloudinary, and Embla Carousel.
- **Sorting and tests:** dnd-kit; Vitest browser tests in Chromium through Playwright, plus a separate Node test suite.

Apollo Client owns server data in the interactive app. GraphQL handles reads and straightforward updates/deletes. Server Actions use Supabase RPCs for create flows and writes that must update related or ordered rows together, including board layout saves. Successful actions update the Apollo cache so the UI reflects the result without a full route refresh.

The public demo reads a designated demo user's data through a server-side admin client. It is read-only; dashboard queries and mutations use the signed-in user's access and database policies.

### Delivery

GitLab CI builds with Vercel tooling, runs both test suites, and publishes JUnit reports. Passing branch pipelines deploy previews; the default branch deploys to production and applies Supabase functions and migrations. A scheduled job rebuilds the CI image.

## Run locally

You need Node.js/npm, a local Supabase instance, and a Cloudinary account if you want image uploads. Install dependencies, start Supabase, and create `.env.local` with these settings:

| Setting                                                                                        | Used for                                                          |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_PROJECT_URL`                                                             | Supabase API URL; local default is `http://127.0.0.1:54321`       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`                                                         | Browser/server Supabase client                                    |
| `SUPABASE_SECRET_KEY`                                                                          | Server-only read of public demo data                              |
| `DEMO_HOMEPAGE_IDENTIFIER`                                                                     | UUID of the user whose boards appear on `/`                       |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image display, upload signing, and cleanup                        |
| `NEXT_PUBLIC_CLOUDINARY_PRESET`, `ALLOWED_CLOUDINARY_PRESET`                                   | Upload preset used by the widget and allowed by the signing route |

Keep secret keys in local environment files, never in Git. The public demo needs boards belonging to `DEMO_HOMEPAGE_IDENTIFIER` to show content. `supabase/seed.sql` creates authentication fixtures; `scripts/mock-data/seed.mjs` creates demo boards and images separately. The `mock-data:dev` and `dev:db-reset` scripts replace local demo data and can delete development Cloudinary assets, so review them before using them. Google sign-in also requires configuring a Google provider and redirect URLs in Supabase.

```bash
npm install
npx supabase start
npm run dev
```

Open `http://localhost:3000`. The app's Supabase URL and key must point to the same instance you started.

## Development commands

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run validate      # lint + typecheck
npm run test:browser  # Chromium component tests
npm run test:node     # server-side tests
npm test              # both suites
npm run build         # production build
```

`npm run codegen` watches GraphQL operations and requires the local GraphQL endpoint. Stop it when generated files are updated. After applying a schema or RPC migration locally, regenerate `supabase/database.types.ts` with `npm run database-type`; do not edit generated types by hand.

## Project map

```text
app/          Routes, layouts, global styles, and API endpoints
components/   Dashboard, board, forms, navigation, and shared UI
gql/          Apollo configuration, operations, and generated GraphQL output
hooks/        Board drag, layout saving, and UI behavior
supabase/     Local config, migrations, seed fixtures, and cleanup functions
utils/        Server Actions, database clients, validation, and helpers
mocks/        Browser and Node test doubles
scripts/      Demo data and development image cleanup
types/        Shared app and JSONB value types
```

## Theme color maintenance

To add a predefined card/tag palette:

1. Add matching `card` and `card-light` tokens to `@theme inline`, `:root`, and `.dark` in `app/globals.css`.
2. Add the value to the `ColorPalette` type and `colorOptions` in `types/schema.ts`.
3. Update the matching database constraint, `color_palette`, or type through a migration.
4. Regenerate database types after applying the migration locally.

Dynamic classes must also be included in the safelist with `@source inline(...)` in `app/globals.css` so Tailwind emits them in the final bundle.
