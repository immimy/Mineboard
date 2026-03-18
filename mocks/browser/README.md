# Lightweight next/\* stubs for Vitest browser tests.

- Renders plain html elements such as <a> tag so components importing next elements like next/link work without pulling Next.js internals that rely on Node's`process`
- Config the `vitest.config.mts` file to replace Next.js modules with stubs
