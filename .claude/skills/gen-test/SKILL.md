---

name: gen-test
description: Generate a Vitest test for a component or util, picking browser or node config based on the target. Only invoke this skill when the user explicitly asks to generate, write, or add a test — phrases like "generate test", "write a test for X", "add tests", "create test for this feature". Do NOT trigger proactively after completing a feature or code change unless the user asks.

---

When generating tests for this project:

- Components in `components/` → use vitest.config.mts (browser/Playwright), import from `vitest-browser-react`
- Utils in `utils/`, server actions, pure functions → use vitest.node.config.mts
- Check `mocks/` for existing stubs before creating new ones
- Run with: `npm run test:browser` or `npm run test:node`
- Never mock Supabase at the module level — use the stubs in `mocks/`
