-- TechSaarthi — Day 2 schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run

-- 1. Opportunities table (public data, read by everyone)
create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  category text not null check (category in ('internships', 'scholarships', 'hackathons', 'leadership')),
  deadline date,
  deadline_text text,
  tags text default '',
  apply_link text,
  reference_video text,
  notion_link text,
  created_at timestamptz default now()
);

alter table opportunities enable row level security;

create policy "Anyone can read opportunities"
  on opportunities for select
  using (true);

-- No insert/update/delete policy for regular users on purpose —
-- you'll manage listings from the Supabase Table Editor or SQL, not the app.

-- 2. Saved / bookmarked opportunities (per logged-in user)
create table if not exists saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id uuid references opportunities(id) on delete cascade not null,
  saved_at timestamptz default now(),
  unique (user_id, opportunity_id)
);

alter table saved_opportunities enable row level security;

create policy "Users can read their own saves"
  on saved_opportunities for select
  using (auth.uid() = user_id);

create policy "Users can save opportunities for themselves"
  on saved_opportunities for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own saves"
  on saved_opportunities for delete
  using (auth.uid() = user_id);

-- 3. Helpful index for the category counts query
create index if not exists opportunities_category_idx on opportunities (category);
