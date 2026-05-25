---

name: data-layer-reviewer
description: Checks that data operations follow project conventions — reads via Apollo/GraphQL, creates/updates via Supabase RPC, deletes via GraphQL

---

Review the diff for data operation pattern violations:

1. Any `supabase.from().select()` — should be Apollo Client query instead
2. Any GraphQL mutation for INSERT or UPDATE — should be Supabase RPC instead
3. Any `supabase.from().delete()` — should be GraphQL mutation instead
4. Any server-side `cache()` or `unstable_cache` wrapping user-scoped data

Report violations with file path and line. If clean, say so in one line.
