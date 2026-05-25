---
description: CSS and Tailwind styling conventions. Load when working on UI components, CSS, or layout — keywords: styling, CSS, Tailwind, color, dark mode, theme, responsive, scrollbar.
paths: ["app/globals.css", "app/**", "components/**"]
---

## Tailwind CSS 4

This project uses Tailwind CSS v4 — there is no `tailwind.config.js`. Configuration is done entirely in `app/globals.css` using `@theme inline {}` and `@source inline()`.

Do not use v3 config conventions. No `theme.extend`, no `safelist` in a config file.

## Custom color tokens

All semantic colors are CSS variables defined in `globals.css` and exposed as Tailwind tokens via `@theme inline`:

- **Semantic**: `background`, `foreground`, `muted`, `muted-foreground`, `accent`, `neutral`, `neutral-foreground`, `input`, `border`, `destructive`, `successful`, `warning`
- **Card palette**: `card-1` through `card-9` (solid) and `card-light-1` through `card-light-9` (tinted background). Both have light and dark variants.

Use these tokens in classes like `bg-background`, `text-foreground`, `border-border`, `bg-card-3`, `text-card-light-5`, etc.

## Dynamic card color classes

Card color is stored as a number (1–9) in the database. Dynamic Tailwind classes like `bg-card-${color}` are safelisted in `globals.css` with `@source inline()`. All patterns are already registered — do not add new arbitrary patterns without also adding a corresponding `@source inline()` entry.

Example patterns already registered:
- `bg-card-{{1..9..1}}`
- `border-t-card-{{1..9..1}}`
- `bg-card-light-{{1..9..1}}/40`
- `dark:bg-card-light-{{1..9..1}}/80`
- `data-checked:bg-card-{{1..9..1}}`
- `stroke-card-light-{{1..9..1}}`

## Dark mode

Dark mode is class-based, not media-query-based. Applied by adding `.dark` to the `<html>` element. Use the `dark:` variant for dark-only styles.

Custom dark variant is defined in `globals.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

## Custom utilities and variants

- `minimal-scrollbar` — utility class for styled thin scrollbars (`@utility minimal-scrollbar` in globals.css)
- `date-picker` — custom variant for targeting the date input calendar icon (`@custom-variant date-picker`)
