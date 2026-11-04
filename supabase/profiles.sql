-- Run in Supabase SQL Editor: Authentication → uses auth.users; store onboarding in public.profiles

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  gender text,
  onboarding jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create index if not exists profiles_email_idx on public.profiles (email);
