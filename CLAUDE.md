# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Coding Standards

Before generating any code, ALWAYS read and follow the relevant documentation in the `/docs` directory. Every piece of code produced must conform to the standards defined there.

- `/docs/ui.md` — UI component and date formatting standards
- `/docs/data-fetching.md` — data fetching rules: Server Components only, Drizzle ORM via `/data` helpers, userId scoping
- `/docs/data-mutations.md` — data mutation rules: `/data` helpers, Server Actions in colocated `actions.ts`, typed params (no FormData), Zod validation
- `/docs/auth.md` — authentication standards: Clerk usage, protecting pages, conditional UI, what not to do
- `/docs/server-components.md` — Server Component standards: awaiting params/searchParams (Next.js 15 Promises), async components, no client APIs
- `/docs/routing.md` — routing standards: all routes under /dashboard, middleware-based route protection via Clerk

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

Next.js 16 app using the App Router with React 19. All source lives under `src/app/`. TypeScript strict mode is on; use the `@/*` path alias for imports from `src/`.

**Styling**: Tailwind CSS 4 — configured via `@theme` directives in `src/app/globals.css` and `@tailwindcss/postcss` in `postcss.config.mjs`. There is no `tailwind.config.js`.

**Fonts**: Geist Sans and Geist Mono loaded via `next/font/google` in `layout.tsx`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`.

**Linting**: ESLint 9 flat config (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`.

**Authentication**: Clerk (`@clerk/nextjs` v7) wraps the app in `ClerkProvider` at `src/app/layout.tsx`. Use the v7 `Show` component (not the older `SignedIn`/`SignedOut`) for conditional rendering based on auth state. `SignInButton`/`SignUpButton` use `mode="modal"`. `UserButton` renders the signed-in user menu. Requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` env vars.
