# FashionOps Studio

FashionOps Studio is a polished Next.js + Supabase SaaS dashboard for fashion studios, creative teams, model booking, campaign tracking, and project/task management.

It serves two purposes:

- A Supabase Auth/RLS proof project for protected routes, user-owned rows, server actions, and policy verification.
- A real-world SaaS dashboard example with premium fashion/creative UI, campaign cards, model/client profiles, image placements, and recent activity.

## Product Concept

FashionOps Studio helps a creative studio manage:

- Campaigns and creative projects
- Bookings and model profiles
- Studio tasks and launch checklists
- Client deliverables
- Recent project activity

The UI is portfolio-ready, but the data model stays intentionally compact so Auth, RLS, and query ownership are easy to inspect.

## What This Proves

- Next.js App Router setup with Supabase Auth
- Cookie-based server/client session handling via `@supabase/ssr`
- Next.js 16 `proxy.ts` session refresh flow
- Protected dashboard route
- User-owned projects and tasks
- PostgreSQL Row Level Security policies using `auth.uid()`
- Server actions for insert/update/delete
- Defensive query filtering using both app-level filters and database-level RLS
- Premium SaaS UI suitable for Upwork or GitHub portfolio review

## Image Assets

Image files live in `public/images` and are referenced by the app with paths such as:

- `/images/auth-hero.jpg`
- `/images/studio-bg.jpg`
- `/images/campaign-1.jpg`
- `/images/campaign-2.jpg`
- `/images/campaign-3.jpg`
- `/images/model-1.jpg`
- `/images/model-2.jpg`
- `/images/model-3.jpg`

The included JPGs are safe generated placeholders. Replace them with licensed fashion, campaign, model, or studio photography before using the project in production or client marketing.

## Screenshot Suggestions

For a portfolio or Upwork attachment, capture:

- The split-screen login/signup page with the large studio hero image.
- The dashboard hero campaign banner.
- Campaign cards showing image thumbnails and progress.
- Model/client profile cards.
- The task list showing create/update/delete behavior.
- A two-user RLS proof where each account sees only its own projects and tasks.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS v4
- Next.js Image component
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security

## Local Setup

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

`.env.local` is ignored by Git. Do not commit Supabase keys or any other secrets.

5. Start the app:

```bash
npm run dev
```

6. Open the app and create two users. Each user should see only their own FashionOps starter campaign and studio tasks.

## Troubleshooting

### Turbopack crash on Windows

If Next.js starts, loads the dashboard, and then Turbopack crashes with `FATAL: An unexpected Turbopack error occurred.`, use the Webpack fallback:

```bash
npm run dev
```

The `dev` script runs `next dev --webpack` for local stability. If the crash persists, stop any running Node/Next processes and clear the local `.next` cache before starting the dev server again.

## Debugging Checklist for a Client Codebase

When a client says their app has broken auth, RLS, or wrong query results, review these areas first:

1. Supabase client setup
   - Is the app using separate browser/server clients correctly?
   - Are cookies refreshed in `proxy.ts`?
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

## Common Failure Examples

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

Fix: Use server/browser Supabase clients and the Next.js proxy session refresh flow.

## How to Present This to a Client

You can say:

> I built FashionOps Studio as both a realistic SaaS dashboard and a compact Supabase Auth/RLS debugging proof. It shows how I structure protected routes, user-owned records, RLS policies, server actions, query debugging, and a polished product UI. For your app, I would inspect the existing schema, policies, auth flow, and queries, then fix the broken parts without rebuilding everything unnecessarily.