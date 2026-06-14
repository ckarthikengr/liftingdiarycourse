# Server Components

## Rule: Always Await `params` and `searchParams`

In Next.js 15, `params` and `searchParams` are **Promises**. They must always be awaited before accessing any property.

```tsx
// ✅ Correct
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { id } = await params;
  const { date } = await searchParams;
}

// ❌ Wrong — params is a Promise, not a plain object
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params.id; // runtime error
}
```

Never destructure `params` or `searchParams` directly in the function signature — always receive them as a typed `Promise<...>` and await them inside the function body.

## Rule: Server Components Must Be `async`

Every Server Component that reads data (params, searchParams, database, auth) must be declared `async`.

```tsx
// ✅ Correct
export default async function Page() { ... }

// ❌ Wrong
export default function Page() { ... }
```

## Rule: No Client APIs in Server Components

Server Components run only on the server. Never use:

- `useState`, `useEffect`, `useRouter`, `useSearchParams`, or any other React hook
- `window`, `document`, `localStorage`, or any browser global
- Event handlers (`onClick`, `onChange`, etc.) directly on Server Component JSX

If any of the above are needed, extract that part into a `"use client"` component.
