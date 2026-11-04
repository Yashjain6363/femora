-- Optional demo data for development. Replace USER_UUID with your auth.users id from
-- Supabase → Authentication → Users, then run in SQL Editor after budget.sql.

/*
insert into public.budget_entries (user_id, entry_type, amount_paise, category, note, occurred_on)
values
  ('USER_UUID', 'income', 5000000, 'pocket_money', 'Monthly allowance', date_trunc('month', now())::date),
  ('USER_UUID', 'expense', 12000, 'food', 'Mess + chai', date_trunc('month', now())::date + 1),
  ('USER_UUID', 'expense', 35000, 'transport', 'Metro top-up', date_trunc('month', now())::date + 3),
  ('USER_UUID', 'expense', 89900, 'entertainment', 'Concert ticket', date_trunc('month', now())::date + 5),
  ('USER_UUID', 'expense', 45000, 'essentials', 'Toiletries', date_trunc('month', now())::date + 7);
*/
