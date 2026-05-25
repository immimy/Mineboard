---
description: Authentication logic and session handling. Load when working on auth flows, middleware, protected routes, or sign-in/sign-out — keywords: auth, login, logout, session, OAuth, middleware, protected route.
paths: ["app/api/auth/**", "middleware.ts", "utils/database/auth.ts", "utils/database/proxy.ts", "utils/actions/auth.ts"]
---

## Auth provider

Google OAuth via Supabase, using the PKCE flow. No password-based auth.

## Flow

1. `utils/database/auth.ts` → `signInWithGoogle()` — server action that calls `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/api/auth?next=/dashboard' })` and redirects to Google's consent screen. Always forces account picker via `queryParams: { prompt: 'select_account' }`.
2. Google redirects back to `app/api/auth/route.ts` — this route handler exchanges the code for a session via `supabase.auth.exchangeCodeForSession(code)`, then redirects to `next` (defaults to `/`).
3. `utils/database/auth.ts` → `signOutWithGoogle()` — server action that calls `supabase.auth.signOut()`.

## Protecting routes

Route protection lives in `utils/database/proxy.ts` → `updateSession()`. This is the Supabase session refresh middleware helper.

- Uses `supabase.auth.getClaims()` to check auth state (not `getUser()` — do not swap these).
- Public routes are passed in as a string array and converted to regexes. The homepage `/` is treated as exact-match only.
- Unauthenticated users hitting a protected route are redirected to `/`.
- Authenticated users hitting `/` are redirected to `/dashboard`.

**Critical**: The `supabase` client created in `updateSession` must not be reused or cached — create a new one per request (Supabase's requirement for Fluid compute compatibility).

## Client factories

- **Server components / route handlers / server actions** → `utils/database/serverClient.ts` → `createClient()` — uses `createServerClient` from `@supabase/ssr` with cookie-based session.
- **Client components** → `utils/database/browserClient.ts` → `createClient()` — uses `createBrowserClient` from `@supabase/ssr`.

Both read `NEXT_PUBLIC_SUPABASE_PROJECT_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from `utils/database/config.ts`.

## Checking auth in server actions

Use `utils/actions/auth.ts` → `authenticateUser(supabase)` — calls `supabase.auth.getUser()` and redirects to `/` if no user. Returns the user object on success.
