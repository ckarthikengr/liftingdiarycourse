# Auth Coding Standards

## Provider: Clerk

This app uses **Clerk** (`@clerk/nextjs` v7) exclusively for authentication. Do not introduce any other auth library (NextAuth, Auth.js, custom JWT, etc.).

## Setup

`ClerkProvider` wraps the entire app in `src/app/layout.tsx`. Required env vars:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Never hard-code these values. Always read them from environment variables.

## Getting the Current User (Server Side)

Use Clerk's `auth()` from `@clerk/nextjs/server` inside Server Components and Server Actions.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

- `userId` is `null` when the user is not signed in — always handle this case.
- Never trust a `userId` passed from the client. Always derive it server-side via `auth()`.

## Protecting Pages

Protect server-rendered pages by checking `userId` at the top of the Server Component and redirecting unauthenticated users:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  // ...
}
```

Do not use middleware-only protection as the sole guard — always validate `userId` in the data layer too (see `docs/data-fetching.md`).

## Conditional UI Rendering

Use the Clerk v7 `<Show>` component for conditional rendering based on auth state. Do **not** use the older `<SignedIn>` / `<SignedOut>` components.

```tsx
import { Show } from "@clerk/nextjs";

<Show when="signedIn">
  <UserButton />
</Show>

<Show when="signedOut">
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</Show>
```

## Auth UI Components

| Purpose | Component |
|---|---|
| Sign in | `<SignInButton mode="modal" />` |
| Sign up | `<SignUpButton mode="modal" />` |
| User menu | `<UserButton />` |

Always use `mode="modal"` for `SignInButton` and `SignUpButton` — do not use dedicated sign-in/sign-up pages unless explicitly required.

## What Not to Do

- Do **not** build a custom auth flow (session cookies, JWTs, bcrypt passwords, etc.)
- Do **not** use `useUser()` or client-side hooks as the source of truth for access control
- Do **not** pass `userId` from client to server — always re-derive it with `auth()` on the server
- Do **not** render protected content conditionally on the client only — enforce access on the server
