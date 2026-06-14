# Routing Coding Standards

## Route Structure

All application routes must live under `/dashboard`. There are no top-level feature routes — everything is nested beneath the dashboard prefix.

```
/dashboard          → main dashboard page
/dashboard/[...]    → all feature sub-pages
```

Do not create routes outside of `/dashboard` for authenticated features.

## Route Protection

All `/dashboard` routes are protected and must only be accessible to signed-in users. Route protection is enforced via **Next.js middleware** — not inside individual page components.

Create or update `src/middleware.ts` to use Clerk's `clerkMiddleware` with a matcher that covers the entire `/dashboard` path:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- `auth.protect()` redirects unauthenticated users to the Clerk sign-in flow automatically.
- The matcher excludes static assets and `_next` internals so middleware does not run on them.

## What Not to Do

- Do **not** create authenticated feature pages outside of `/dashboard`
- Do **not** rely solely on per-page `userId` checks for route protection — middleware is the first line of defence (though data-layer scoping via `userId` is still required per `docs/data-fetching.md`)
- Do **not** use a custom redirect-based guard in every page component as a substitute for middleware
