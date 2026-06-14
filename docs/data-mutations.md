# Data Mutations

## Rule: Drizzle ORM via `/data` Helpers

All database mutations **must** go through helper functions located in the `src/data` directory. These helpers use Drizzle ORM exclusively.

**Never** write inline `db` calls inside Server Actions or components. No raw SQL, no `db.execute()` with template strings.

### Example structure

```
src/
  data/
    workouts.ts    # createWorkout(), updateWorkout(), deleteWorkout(), etc.
    exercises.ts   # createExercise(), deleteExercise(), etc.
```

### Example helper

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, userId));
}
```

## Rule: Server Actions Only

All data mutations **must** be performed via Server Actions. **Never** mutate data via:

- Route handlers (`/api/*`)
- Client-side `fetch` / `axios`
- `useEffect` with POST/PUT/DELETE calls

## Rule: Colocated `actions.ts` Files

Server Actions **must** live in a file named `actions.ts` colocated with the route segment that uses them.

```
src/
  app/
    workouts/
      actions.ts   # Server Actions for the workouts route
      page.tsx
    workouts/[id]/
      actions.ts   # Server Actions for a specific workout
      page.tsx
```

**Never** place Server Actions in shared utility files, `/data` helpers, or component files.

## Rule: Typed Parameters — No `FormData`

Every Server Action **must** have explicitly typed parameters. The `FormData` type is **never** permitted as a parameter type.

```ts
// ✅ Correct — explicit typed params
"use server";

export async function createWorkout(name: string, date: Date) { ... }

// ❌ Wrong — FormData is banned
export async function createWorkout(formData: FormData) { ... }
```

## Rule: Zod Validation on Every Server Action

Every Server Action **must** validate all arguments with Zod before touching the database.

- Define a Zod schema for the action's inputs at the top of the action.
- Call `.parse()` (throws on failure) or `.safeParse()` (handle the error explicitly) before any other logic.
- Never assume arguments are valid based on the call site.

### Example Server Action

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = CreateWorkoutSchema.parse({ name, date });
  return createWorkout(userId, parsed.name, parsed.date);
}
```

## Rule: No `redirect()` Inside Server Actions

**Never** call `redirect()` from `next/navigation` inside a Server Action. Redirects must be handled client-side after the Server Action resolves.

```ts
// ❌ Wrong — redirect() inside a Server Action
"use server";
import { redirect } from "next/navigation";

export async function createWorkoutAction(name: string, date: Date) {
  // ...
  redirect("/dashboard"); // banned
}

// ✅ Correct — Server Action returns, client redirects
"use server";

export async function createWorkoutAction(name: string, date: Date) {
  // ...
  return { success: true };
}
```

```tsx
// Client component calls the action then redirects
"use client";
import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

const router = useRouter();

async function handleSubmit() {
  await createWorkoutAction(name, date);
  router.push("/dashboard");
}
```

## Rule: Users Can Only Mutate Their Own Data

Every mutation helper **must** scope writes to the authenticated `userId`. Always obtain `userId` from Clerk's `auth()` inside the Server Action — never accept it as a parameter from the client.

Failing to scope mutations by `userId` is a **critical security bug**.
