---
description: React component structure and patterns. Load when working on UI components or app pages — keywords: component, React, props, context, fragment, Headless UI, skeleton, server component, client component.
paths: ["components/**", "app/**"]
---

## Component folder layout

Components are grouped by feature under `components/`:

- `Board/` — Board, Card, List, ListItem containers and context providers
- `Dashboard/` — Dashboard-level components
- `Mutation/` — Components that wrap GraphQL mutations (grouped by operation)
- `global/` — Shared primitives: `Container`, `FormContainer`, `SubmitButton`, `LoadingContainer`, `NoDataFound`, `Error`, `ApolloWrapper`
- `Homepage/`, `Navbar/`, `Skeleton/`, `Slider/`, `ListField/`, `Mocks/`

## GraphQL fragments in components

Components that render data from GraphQL define their own fragment with the `graphql()` tag and accept a `FragmentType<typeof XFragment>` prop. Call `useFragment()` to unwrap it:

```tsx
const XFragment = graphql(/* GraphQL */ `fragment X on SomeType { ... }`);
type XProps = { query: FragmentType<typeof XFragment> };
function X({ query }: XProps) {
  const data = useFragment(XFragment, query).node;
  ...
}
```

This is the standard data-fetching pattern for all leaf components. Do not pass raw query results as props.

## Context pattern

Feature areas use React Context for shared state. Examples: `BoardContext`, `CardContext` in `components/Board/`. Context providers are co-located with the feature folder.

## Server vs client components

Next.js App Router — components are Server Components by default. Add `'use client'` only when needed (event handlers, hooks, browser APIs). The `ApolloWrapper` component (`components/global/ApolloWrapper.tsx`) is a client component that wraps the app tree for browser-side Apollo usage.

## Headless UI

`@headlessui/react` v2 is used for accessible interactive components (dialogs, menus, etc.). Follow Headless UI v2 API — it differs from v1 (no `as` prop on `Transition`, no separate `Transition.Child`).

## Skeleton loading

Use `components/Skeleton/` components as loading states. Pair with Next.js `loading.tsx` or Suspense boundaries.
