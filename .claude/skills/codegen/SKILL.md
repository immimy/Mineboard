---

name: codegen
description: Regenerate GraphQL types when GraphQL operations (queries, mutations, fragments) in source files have changed
disable-model-invocation: true

---

1. Run this command and capture its output:
   ```
   git diff --name-only HEAD && git diff --name-only --cached
   ```
   Deduplicate the results. Filter to files that:
   - Match `(app|components|gql|utils/actions)/.*\.(ts|tsx)$`
   - Do NOT match `gql/__generated__/`
   
   Then check each remaining file for the string `graphql(` using grep. If none of the filtered files contain `graphql(`, print "No GraphQL operations changed — skipping codegen." and stop.

2. Run `npm run codegen` in one-shot mode (not watch).

3. Run `git diff gql/__generated__/` and summarise what changed: added types, removed types, modified signatures. Flag any field removal that would break an existing query.
