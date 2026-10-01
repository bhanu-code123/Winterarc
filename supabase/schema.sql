-- Winter Arc Tracker database schema
-- Run this once in Supabase -> SQL Editor -> New query -> Run

-- 1. User profile (display name)
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text default '',
  updated_at  timestamptz default now()
);

-- 2. One row per user per month. All tracker data lives in a JSON column:
--    { habits: [10 names], checks: {"habitIndex-day": true},
--      sleep: {"day": sleepRowIndex}, goals: [5], review: {well, hard, next}, notes: "" }
create table if not exists public.months (
  user_id     uuid not null references auth.users (id) on delete cascade,
  month       text not null check (month ~ '^\d{4}-\d{2}$'),  -- e.g. 2026-10
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz default now(),
  primary key (user_id, month)
);

-- 3. Row Level Security: each user can only read and change their own rows
alter table public.profiles enable row level security;
alter table public.months   enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own months" on public.months;
create policy "own months" on public.months
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
