# TechSaarthi — Day 1

Landing page + auth (Supabase) + protected dashboard skeleton. React + Vite + Tailwind v4 + React Router.

## 1. Install

```bash
npm install
```

## 2. Set up Supabase (5 min)

1. Go to https://supabase.com → New project (free tier is fine).
2. Once it's created, go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
3. In this folder, copy the env file and paste those values in:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. In the Supabase dashboard, go to **Authentication → Providers** and make sure **Email** is enabled (it is by default).
5. Optional but recommended for a 3-day demo: **Authentication → Settings → Email Auth** → turn **"Confirm email"** OFF, so signup logs people in immediately instead of waiting on a confirmation email. Turn it back on later if you want the real flow.

That's it — no tables needed yet. Day 2 adds the `opportunities` and `saved_opportunities` tables.

## 3. Run it

```bash
npm run dev
```

Visit http://localhost:5173. Try:
- Landing page loads at `/`
- `/signup` → creates a real Supabase user
- `/login` → logs in
- `/dashboard` → only reachable when logged in; redirects to `/login` otherwise
- Sign out from the dashboard navbar → redirects home

## 4. Deploy to Vercel today (10 min)

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com → **Add New Project** → import the repo.
3. Framework preset: Vercel should auto-detect **Vite**. Leave build command as `npm run build`, output dir `dist`.
4. Under **Environment Variables**, add the same two keys from your `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. You'll get a live `.vercel.app` URL — put it somewhere you can see it, you'll redeploy from the same project for Day 2 and 3.

## Day 2 — real opportunity data + save/bookmark

### 1. Create the tables

In your Supabase project: left sidebar → **SQL Editor** → **New query**.

1. Paste the contents of `sql/01_schema.sql`, click **Run**. This creates the
   `opportunities` and `saved_opportunities` tables with row-level security —
   opportunities are readable by anyone, but each user can only see/save/unsave
   their own bookmarks.
2. New query again, paste `sql/02_seed.sql`, click **Run**. This drops in 15
   placeholder listings (4 internships, 4 scholarships, 4 hackathons, 3
   leadership programs) so the app has real data to show today.

You can check it worked: **Table Editor** in the sidebar should now show both
tables, with `opportunities` holding 15 rows.

### 2. Replace the placeholder links with real ones

Every row in `02_seed.sql` has `apply_link`, `reference_video`, and
`notion_link` fields. Right now `notion_link` is the same placeholder
(`https://notion.so/your-page`) on every row — swap that for your actual
Notion page link. Easiest way: **Table Editor → opportunities**, click into
each row's `notion_link` cell and paste the real URL directly, no need to
re-run SQL. Same for `apply_link` and `reference_video` as you get real ones.

If you want one shared Notion page for all "View Details" clicks for now
(rather than a unique page per opportunity), just paste that one URL into
every row — the app doesn't care either way.

### 3. What's new in the app

- Dashboard's opportunity cards now show **live counts** pulled from Supabase
  instead of hardcoded numbers.
- Clicking a category card takes you to `/dashboard/opportunities/:category`
  — a real list of cards with title, organization, deadline (with an "N days
  left" flag inside 2 weeks), tags, apply link, reference video (if present),
  a **Save** toggle, and **View Details** which opens the Notion link in a
  new tab.
- Save/unsave writes to the `saved_opportunities` table immediately — try it,
  then check **Table Editor → saved_opportunities** in Supabase to see the row
  appear.

### 4. Managing listings going forward

There's no admin UI in the app on purpose — for a 3-day MVP, adding or editing
opportunities directly in **Supabase → Table Editor → opportunities** is
faster than building a form. Add a row, fill in the columns, save — it shows
up on the site immediately, no redeploy needed.

## What's stubbed for later

- **Chatbot / Motivate Me** — Day 3, via a serverless function so the LLM API key never touches the browser.
- **Smart filtering, weekly digest, resume analysis, admin panel** — explicitly cut from MVP scope; revisit after launch.

## Project structure

```
src/
  components/    Navbar, Hero, OpportunitySection, AboutUs, WhatWeOffer, Footer, ProtectedRoute
  context/       AuthContext.jsx — wraps Supabase auth state
  data/          opportunities.js — placeholder category data
  lib/           supabaseClient.js
  pages/         Landing, Login, Signup, Dashboard
```
