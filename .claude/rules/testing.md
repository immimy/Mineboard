---
description: Testing setup, patterns, and mock conventions. Load when writing or reading tests — keywords: test, spec, vitest, mock, stub, browser test, node test.
paths: ["mocks/**", "vitest.config.mts", "vitest.node.config.mts", "vitest.setup.ts", "vitest.node.setup.ts"]
---

## Two test environments

This project runs two separate Vitest configurations:

| Config | Command | Environment | Includes |
|---|---|---|---|
| `vitest.config.mts` | `npm run test:browser` | Playwright/Chromium | All tests **except** `*.node.test.ts` |
| `vitest.node.config.mts` | `npm run test:node` | Node | Only `*.node.test.ts` files |

Name test files `*.node.test.ts` for node-only tests (e.g. server actions, API routes). Everything else runs in the browser config.

## Test output

JUnit reports write to `reports/`:
- Browser: `reports/junit-report.xml`
- Node: `reports/junit-node-report.xml`

## Module stubs

Both configs use path aliases to swap real modules for lightweight stubs at test time. Stubs are in `mocks/`:

```
mocks/
  browser/
    next/link.tsx, next/image.tsx, next/headers.ts, next/navigation.ts
    react-toastify/toast.ts
    supabase/serverClient.ts, supabase/ssr.ts
  node/
    next/headers.ts, next/navigation.ts
    supabase/serverClient.ts, supabase/ssr.ts
```

When adding new tests: if a module fails to import in the test environment, add a stub to the appropriate `mocks/browser/` or `mocks/node/` folder and register it in the matching vitest config's `resolve.alias`.

## Setup files

- `vitest.setup.ts` — browser test setup
- `vitest.node.setup.ts` — node test setup

## Globals

`globals: true` is set in both configs — `describe`, `it`, `expect`, `vi` are available without imports.
