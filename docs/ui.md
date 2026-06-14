# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, dialogs, badges, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- All UI primitives must come from shadcn/ui — install new components via `npx shadcn@latest add <component>`
- You may compose shadcn/ui components together to build page-level layouts, but the leaf UI elements must always be shadcn/ui components

## Date Formatting

All date formatting must use **date-fns**.

Dates must be displayed using ordinal day notation in the format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use `format` together with `do` (ordinal day token), `MMM` (abbreviated month), and `yyyy` (full year):

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy")
// → "1st Sep 2025", "2nd Aug 2025", "3rd Jan 2026", "4th Jun 2024"
```

Never use `Date.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date library.
