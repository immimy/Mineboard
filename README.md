## Authentication workflow

User clicks "Sign in with Google"
↓
Server Action calls supabase.auth.signInWithOAuth()
↓
Supabase returns a Google OAuth URL → user is redirected
↓
User authenticates on Google's consent screen
↓
Google redirects to /api/auth?code=...
↓
Route Handler exchanges code for a session (PKCE)
↓
Session is saved to cookies → user redirected to /dashboard
↓
Proxy protects /dashboard on every request

## Add predefined color pallette for user

1. Add `card` and `card-light` in

- `@theme inline {}`
- `:root {}`
- `.dark {}`

2. Add new value to the `ColorPalette` type and `colorOptions` constant in the '@/types/schema.ts'

3. Alter `color_palette` type in the database to include new colors

## Enable dynamic class with tailwindcss

Add the arbitrary class with dynamic values in the safelist to ensure that the tailwindcss always include these classes in the final CSS bundle, even if you don't see them in a source code.

- Add `@source inline("...")` in the 'globals.css'
