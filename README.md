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

- **Smart filtering, weekly digest, resume analysis, admin panel** — explicitly cut from MVP scope; revisit after launch.

## Day 3 — AI chatbot + Motivate Me

### 1. Get a free Gemini API key

1. Go to https://aistudio.google.com/apikey (sign in with any Google account).
2. Click **Create API key**. Free tier is generous enough for a student MVP demo.
3. Copy the key.

### 2. Add it to your environment

In your `.env` file, add:
```
GEMINI_API_KEY=your-gemini-api-key
```
Notice this one has **no `VITE_` prefix**, unlike your Supabase keys — that's
intentional. Vite only bundles `VITE_`-prefixed variables into the browser
code; leaving this one unprefixed means it stays server-side, inside
`api/chat.js`, and never reaches anyone's browser dev tools. Don't rename it.

### 3. Testing it locally (needs the Vercel CLI)

`npm run dev` only runs the Vite frontend — it doesn't know how to run
`api/chat.js`, since that's a Vercel serverless function, not part of your
React app. To test the chatbot before deploying, run both together with the
Vercel CLI:

```bash
npm install -g vercel      # one-time
vercel login                # one-time, opens a browser to authenticate
vercel link                 # one-time per project, connects this folder to a Vercel project
vercel env pull .env.local  # pulls env vars you've set in the Vercel dashboard
vercel dev                  # runs frontend + /api together, usually on localhost:3000
```

If you haven't deployed to Vercel yet, `vercel link` will offer to create a
new project for you — say yes, then go add `GEMINI_API_KEY` (and your two
Supabase vars) under that project's **Settings → Environment Variables** in
the Vercel dashboard before running `vercel env pull`.

Alternative: skip local testing and just deploy — see below, it's the same
effort either way for a solo dev on a deadline.

### 4. Deploying

Same Vercel project as before. Just make sure these 3 environment variables
are set under **Settings → Environment Variables** (Production *and*
Preview):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

Push to GitHub, Vercel redeploys automatically. `/api/chat.js` is picked up
with zero config — Vercel auto-detects anything in an `/api` folder as a
serverless function alongside your static Vite build.

### 5. What's new in the app

- A floating chat button, bottom-right, on every dashboard page (hidden on
  the public landing page and while logged out).
- Click it → a chat panel opens. Ask about eligibility, what a program
  involves, or general career questions — it's grounded with a system prompt
  about TechSaarthi's categories, not a generic chatbot.
- **Motivate Me** — a button on the dashboard hero (and inside the chat panel
  before you've sent anything) that requests a short, warm, specific
  motivational message with one concrete next step, not generic positivity.
- Your API key is never sent to the browser — every request goes
  `browser → /api/chat.js → Gemini`, with the key only living in the
  serverless function's environment.

### 6. If the chatbot doesn't respond

- Check the browser console and the Vercel function logs (**Vercel dashboard
  → your project → Deployments → click a deployment → Functions**) — the
  most common cause is `GEMINI_API_KEY` missing or mistyped in Vercel's env
  vars, or not pulled locally via `vercel env pull`.
- Free-tier Gemini keys have a requests-per-minute limit — if you're testing
  rapidly, you may hit it. Wait a minute and try again.

## Day 2b — Saved page, flexible deadlines, bulk CSV import

### 1. Run the migration

You already ran `01_schema.sql` and `02_seed.sql` before, so just run the new
migration file in **SQL Editor**:

1. Paste and run `sql/03_migration_tags_and_deadline.sql`. This does two things:
   - Converts `tags` from a Postgres array to plain comma-separated text —
     way easier to type into a spreadsheet, no special syntax.
   - Adds `deadline_text`, a freeform field for opportunities without one
     fixed date (e.g. `"Rolling admissions"`, `"Closes end of Nov"`, `"Check
     website"`). When it's filled in, it overrides the exact-date badge on
     the card. Leave it blank and the app falls back to the `deadline` date
     as before, or "Rolling / no fixed deadline" if both are empty.
2. Re-run `sql/02_seed.sql` to refresh the placeholder rows in the new format
   (it truncates first, so this is safe).

### 2. Bulk-adding opportunities without SQL or forms

For anything beyond a handful of rows, don't add them one at a time in Table
Editor — use CSV import instead:

1. Open `data-templates/opportunities_template.csv` in Google Sheets or
   Excel. It has the exact columns the table expects, with two example rows.
2. Fill in as many rows as you have opportunities for. Notes on the columns:
   - `category` must be exactly one of `internships`, `scholarships`,
     `hackathons`, `leadership` — a typo will make that row fail to import.
     In Google Sheets, select the column → **Data → Data validation** → list
     of those 4 values, so you can only pick from a dropdown.
   - `deadline` format is `YYYY-MM-DD`. Leave it blank if you're using
     `deadline_text` instead.
   - `tags` is one cell, comma-separated, e.g. `Remote, Paid, Female-only`.
   - Leave `reference_video` blank if you don't have one — it just won't
     show on the card.
3. **File → Download → Comma-separated values (.csv)**.
4. In Supabase: **Table Editor → opportunities → Insert → Import data from
   CSV**, upload your file, confirm the column mapping, import.

That's it — 100 rows in one pass, no code involved. Re-do this anytime you
have a new batch; existing rows won't be touched unless you re-import over
the same IDs.

### 3. What's new in the app

- **`/dashboard/saved`** — every opportunity you've bookmarked, across all
  four categories, in one place. Linked from the "Saved" button in the
  dashboard navbar. Un-saving from here removes it from the list immediately.
- Deadline badges now show your `deadline_text` when you've set one, instead
  of forcing an exact date.
- Tags are plain text now (`tags` column), not a Postgres array — matters
  only if you're editing rows directly in Table Editor or writing SQL by hand.

## Project structure

```
src/
  components/    Navbar, Hero, OpportunitySection, AboutUs, WhatWeOffer, Footer, ProtectedRoute
  context/       AuthContext.jsx — wraps Supabase auth state
  data/          opportunities.js — placeholder category data
  lib/           supabaseClient.js
  pages/         Landing, Login, Signup, Dashboard
```
