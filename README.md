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
