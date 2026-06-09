/** Supabase Security Advisors: "0026 pg graphql anon table exposed"
    ---
    Any requests with ANON key can get a response of GraphQL introspection query.
    This exposes schema structure in production.
    So we revoke the privileges from anon users on the following table: boards, cards, lists, list_fields, list_values.
    Since the tables should only be exposed to authenticated users.
*/

revoke select on public.boards from anon;
revoke select on public.cards from anon;
revoke select on public.lists from anon;
revoke select on public.list_fields from anon;
revoke select on public.list_values from anon;