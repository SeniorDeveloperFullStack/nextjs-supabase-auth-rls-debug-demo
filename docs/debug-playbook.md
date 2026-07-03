# Supabase Auth/RLS Debug Playbook

Use this playbook when a client says their Next.js + Supabase app is half-working but not launch-ready.

## 1. Confirm the app shape

- Next.js version and whether it uses App Router or Pages Router
- Where Supabase clients are created
- Whether the app uses server components, client components, route handlers, middleware, or API routes
- Which tables are exposed through the Supabase client
- Whether RLS is enabled on all public tables

## 2. Reproduce the issue

Create or use two test users:

- user-a@example.com
- user-b@example.com

Then test:

- Can User A sign in?
- Can User B sign in?
- Can each user see only their own records?
- Can each user insert a record?
- Can each user update/delete their own records?
- Can a user read/update/delete another user's record by changing an ID?

## 3. Inspect policies before changing frontend code

Many Supabase bugs look like React bugs but are actually policy issues.

Check:

- Missing select policy
- Missing insert policy
- Missing update policy
- Missing delete policy
- `using` references the wrong column
- `with check` missing on insert/update
- RLS disabled on table
- Policy allows `true` when rows should be user-owned

## 4. Inspect query design

Common mistakes:

- Query does not filter by `owner_id`
- Query runs before session is loaded
- Query expects a join relationship that does not exist
- Query uses `.single()` when zero rows are possible
- Query ignores Supabase `error`
- Query returns empty due to RLS and developer assumes the table is empty

## 5. Fix in small passes

Do not rebuild the app first.

Recommended sequence:

1. Fix environment variables and Supabase clients.
2. Fix auth/session flow.
3. Fix RLS policies.
4. Fix schema/relationship issues.
5. Fix individual queries.
6. Add basic error handling.
7. Document what was wrong.

## 6. Client explanation format

Use this simple explanation after each fix:

- Problem: What the user saw.
- Cause: The actual technical reason.
- Fix: What was changed.
- Impact: What now works and what is safer.

Example:

Problem: Tasks returned an empty list after login.
Cause: The frontend query was correct, but the tasks table had RLS enabled without a select policy.
Fix: Added `tasks_select_own` using `auth.uid() = owner_id`.
Impact: Users now see only their own tasks, and other users' tasks remain protected.
