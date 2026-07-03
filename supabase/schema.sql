-- Next.js + Supabase Auth/RLS Debug Demo
-- Run this in the Supabase SQL Editor after creating a project.
-- It creates a simple projects/tasks model where every row belongs to auth.uid().

create extension if not exists "pgcrypto";

-- 1) Profiles mirror auth.users for app-level profile data.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- 2) Projects are owned by one authenticated user.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- 3) Tasks belong to both a project and a user.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  status text not null default 'open' check (status in ('open', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on public.projects(owner_id);
create index if not exists tasks_owner_id_idx on public.tasks(owner_id);
create index if not exists tasks_project_id_idx on public.tasks(project_id);

-- Keep project ownership consistent.
create or replace function public.prevent_cross_owner_task()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.projects p
    where p.id = new.project_id
      and p.owner_id = new.owner_id
  ) then
    raise exception 'Task owner must match project owner';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_cross_owner_task on public.tasks;
create trigger trg_prevent_cross_owner_task
before insert or update of project_id, owner_id on public.tasks
for each row execute function public.prevent_cross_owner_task();

-- Create profile + starter project when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  insert into public.projects (owner_id, name)
  values (new.id, 'Launch Readiness Project')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Grant minimum table privileges. RLS still decides which rows are visible/changeable.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;

-- Enable RLS.
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

-- Remove old policies before recreating them for repeatable setup.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

-- Profiles: users can read/update only their own profile.
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Projects: users can manage only their own projects.
create policy "projects_select_own"
on public.projects
for select
to authenticated
using (auth.uid() = owner_id);

create policy "projects_insert_own"
on public.projects
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "projects_update_own"
on public.projects
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "projects_delete_own"
on public.projects
for delete
to authenticated
using (auth.uid() = owner_id);

-- Tasks: users can manage only their own tasks.
create policy "tasks_select_own"
on public.tasks
for select
to authenticated
using (auth.uid() = owner_id);

create policy "tasks_insert_own"
on public.tasks
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "tasks_update_own"
on public.tasks
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "tasks_delete_own"
on public.tasks
for delete
to authenticated
using (auth.uid() = owner_id);

-- Debug checks to run after creating two users:
-- select * from public.projects; -- Each user should only see their own rows through the app client.
-- select * from public.tasks;    -- Each user should only see their own task rows through the app client.
