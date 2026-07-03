# Next.js + Supabase Auth/RLS Debug Demo

This is a focused proof project for Upwork clients who already have a partially working Next.js + Supabase app and need help fixing auth, RLS, query logic, and launch-readiness issues without a full rebuild.

## What this proves

- Next.js App Router setup with Supabase Auth
- Cookie-based server/client session handling via `@supabase/ssr`
- Protected dashboard route
- User-owned projects and tasks
- PostgreSQL Row Level Security policies using `auth.uid()`
- Server actions for insert/update/delete
- Defensive query filtering using both app-level filters and database-level RLS
- Debug-friendly error messages for common Supabase issues

## Tech stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project.

3. Open the Supabase SQL Editor and run:

```bash
supabase/schema.sql
```

4. Copy `.env.example` to `.env.local` and add your values:

```bash
cp .env.example .env.local
```

5. Start the app:

```bash
npm run dev
```

6. Open the app and create two users. Each user should see only their own starter project and tasks.

## Debugging checklist for a client codebase

When a client says their app has broken auth, RLS, or wrong query results, review these areas first:

1. Supabase client setup
   - Is the app using separate browser/server clients correctly?
   - Are cookies refreshed in middleware?
   - Are auth calls using `getUser()` on the server when security matters?

2. Auth flow
   - Does sign-up/sign-in redirect correctly?
   - Is the callback route exchanging the code for a session?
   - Are protected pages redirecting unauthenticated users?

3. RLS policies
   - Is RLS enabled on all exposed public tables?
   - Are select policies present?
   - Are insert/update policies using `with check`?
   - Do policies use `auth.uid()` against the right owner/user column?

4. Database relationships
   - Do records have a clear owner column?
   - Are foreign keys correct?
   - Can cross-user records be inserted by mistake?

5. Query logic
   - Are queries filtered by the current user?
   - Are nested selects/joins matching the actual schema?
   - Are empty results caused by RLS instead of frontend logic?

## Common failure examples

### Problem: Query returns empty data

Likely cause: RLS blocks the row or there is no select policy.

Fix: Add a select policy such as:

```sql
create policy "tasks_select_own"
on public.tasks
for select
to authenticated
using (auth.uid() = owner_id);
```

### Problem: Insert fails even when select works

Likely cause: missing insert policy or missing `with check`.

Fix:

```sql
create policy "tasks_insert_own"
on public.tasks
for insert
to authenticated
with check (auth.uid() = owner_id);
```

### Problem: User sees another user's data

Likely cause: missing owner filter in app query, disabled RLS, or overly broad policy.

Fix: Filter by the current user in the app and enforce the same rule in RLS.

### Problem: Auth works locally but breaks after refresh

Likely cause: client-only auth handling with no cookie-based SSR flow.

Fix: Use server/browser Supabase clients and middleware session refresh.

## How to present this to a client

You can attach the PDF case study and say:

> I created a small Next.js/Supabase Auth/RLS debugging example that matches the kind of issue you described. It shows how I structure protected routes, user-owned records, RLS policies, and query debugging. For your app, I would first inspect your existing schema, policies, auth flow, and queries, then fix only the broken parts instead of rebuilding everything.
