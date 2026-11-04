-- Budget entries: expenses + pocket money (income). Run after profiles.sql.
-- Amounts stored in paise (1 INR = 100 paise) to avoid floating-point issues.

create table if not exists public.budget_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_type text not null check (entry_type in ('expense', 'income')),
  amount_paise bigint not null check (amount_paise > 0 and amount_paise <= 5000000000),
  category text not null default 'other',
  note text not null default '',
  occurred_on date not null default (timezone('utc', now()))::date,
  created_at timestamptz not null default now()
);

create index if not exists budget_entries_user_occurred_idx
  on public.budget_entries (user_id, occurred_on desc);

create index if not exists budget_entries_user_id_idx
  on public.budget_entries (user_id);

alter table public.budget_entries enable row level security;

create policy "budget select own"
  on public.budget_entries for select
  using (auth.uid() = user_id);

create policy "budget insert own"
  on public.budget_entries for insert
  with check (auth.uid() = user_id);

create policy "budget update own"
  on public.budget_entries for update
  using (auth.uid() = user_id);

create policy "budget delete own"
  on public.budget_entries for delete
  using (auth.uid() = user_id);
