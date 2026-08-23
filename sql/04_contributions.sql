-- TechSaarthi — Day 4: community contributions
-- Run this in Supabase SQL Editor. Adds two new tables:
--   1. submitted_opportunities — students suggest listings; nothing goes live
--      until you approve it (see the approve_submission() function below).
--   2. posts — the "share your experience" blog. Same pending -> published
--      moderation pattern, so nothing publishes without you reviewing it.

-- ============================================================ SUBMISSIONS
create table if not exists submitted_opportunities (
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
  submitter_note text,          -- "why I'm submitting this / what I experienced"
  submitted_by uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

alter table submitted_opportunities enable row level security;

create policy "Users can submit opportunities"
  on submitted_opportunities for insert
  with check (auth.uid() = submitted_by);

create policy "Users can see their own submissions"
  on submitted_opportunities for select
  using (auth.uid() = submitted_by);

-- No public select policy: pending/rejected submissions are never visible to
-- anyone but their submitter until approved (at which point they're copied
-- into the real `opportunities` table, which already has public read access).
-- No update/delete policy from the app side either — review happens via
-- Supabase SQL Editor / Table Editor, or the approve_submission() function
-- below, both of which use your own dashboard access, not the anon key.

-- One-step approval: copies a submission into the live opportunities table
-- and marks it approved, in a single transaction.
create or replace function approve_submission(submission_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  new_id uuid;
begin
  insert into opportunities (title, organization, category, deadline, deadline_text, tags, apply_link, reference_video, notion_link)
  select title, organization, category, deadline, deadline_text, tags, apply_link, reference_video, notion_link
  from submitted_opportunities
  where id = submission_id and status = 'pending'
  returning id into new_id;

  if new_id is not null then
    update submitted_opportunities
    set status = 'approved', reviewed_at = now()
    where id = submission_id;
  end if;

  return new_id;
end;
$$;

-- ==================================================================== POSTS
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,                       -- markdown, rendered client-side
  author_id uuid references auth.users(id) on delete cascade not null,
  is_anonymous boolean not null default false,
  author_display_name text,                 -- shown if not anonymous; falls back to account name if null
  author_linkedin text,                     -- optional, only shown if not anonymous
  related_category text check (related_category in ('internships', 'scholarships', 'hackathons', 'leadership')),
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  published_at timestamptz,
  created_at timestamptz default now()
);

alter table posts enable row level security;

create policy "Anyone can read published posts"
  on posts for select
  using (status = 'published' or auth.uid() = author_id);

create policy "Users can write their own posts"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "Users can edit their own pending posts"
  on posts for update
  using (auth.uid() = author_id and status = 'pending')
  with check (auth.uid() = author_id and status = 'pending');

create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = author_id);

create index if not exists posts_status_idx on posts (status, published_at desc);

-- ===================================================== Reviewing content
-- Publish a post:
--   update posts set status = 'published', published_at = now() where id = '...';
-- Reject a post:
--   update posts set status = 'rejected' where id = '...';
-- Approve an opportunity submission:
--   select approve_submission('...');
-- Reject one:
--   update submitted_opportunities set status = 'rejected', reviewed_at = now() where id = '...';
