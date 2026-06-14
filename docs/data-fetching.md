# Data Fetching

## Rule: Server Components Only

All data fetching in this app **must** be done exclusively via  Server Components.

**Never** fetch data via:
- Route handlers (`/api/*`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side data fetching library

If a component needs data, it must be a Server Component that awaits a helper function from the `/data` directory.

## Rule: Drizzle ORM via `/data` Helpers

All database queries **must** go through helper functions located in the `/data` directory. These helpers use Drizzle ORM exclusively.

**Never** write raw SQL. No `db.execute()` with template strings, no `sql\`...\`` tagged literals bypassing the ORM schema.

### Example structure

```
src/
  data/
    workouts.ts    # getWorkoutsForUser(), getWorkoutById(), etc.
    exercises.ts   # getExercisesForUser(), etc.
```

### Example helper

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example Server Component consuming the helper

```ts
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();
  const workouts = await getWorkoutsForUser(userId!);
  // ...
}
```

## Rule: Users Can Only Access Their Own Data

This is a hard security requirement. Every helper function that reads user-owned data **must** filter by the authenticated `userId`. There must be no query that returns another user's records.

- Obtain `userId` from Clerk's `auth()` (server-side) — never trust a `userId` passed from the client.
- Pass `userId` as an explicit argument into every `/data` helper that touches user-owned rows.
- Always include a `where(eq(table.userId, userId))` (or equivalent) clause so the database enforces the boundary, not just application logic.

Failing to scope queries by `userId` is a **critical security bug**.
