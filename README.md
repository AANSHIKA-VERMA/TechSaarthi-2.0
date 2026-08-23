# TechSaarthi

**A guided discovery platform for tech opportunities — built for women BTech students to find internships, scholarships, hackathons, and leadership programs in one place, instead of forty scattered tabs.**

Live: _add your deployed URL here_

---

## The problem

Opportunities for early-career women in tech — internships, scholarships, hackathons, fellowships — exist, but discovery is broken: they're scattered across WhatsApp forwards, stale PDFs, and portals nobody checks regularly. Talented students miss deadlines they'd have easily qualified for, not from lack of skill but from lack of visibility. TechSaarthi centralizes verified opportunities into one browsable, bookmarkable, guided experience — with an AI assistant on hand for eligibility questions and encouragement.

## Features

- **Auth-gated dashboard** — email/password signup and login, protected client-side routing
- **Opportunity discovery** — four categories (internships, scholarships, hackathons, leadership programs), each showing live counts pulled from the database
- **Structured listings** — every opportunity carries organization, deadline (or a flexible free-text status like "Rolling admissions" for open-ended ones), tags, an apply link, an optional reference video, and a link to a full external brief
- **Save / bookmark** — one-click save on any listing, with a dedicated page showing everything a user has bookmarked across all categories
- **AI mentor** — a chat widget that acts as a career mentor: asks a clarifying question when it doesn't know enough about the student (year, interest area, what she's looking for), then gives concrete, platform-grounded next steps rather than generic advice. "Motivate Me" opens the same mentor persona rather than a separate canned-response mode.
- **Bulk data entry** — opportunities are managed via CSV import into the database rather than a custom admin UI, so hundreds of listings can be added in one pass without hand-building forms

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast dev loop, small production bundle |
| Styling | Tailwind CSS v4 | Utility-first, no separate design-system build |
| Routing | React Router | Client-side routing with auth-protected routes |
| Auth + Database | Supabase (Postgres + Auth) | Managed auth, relational data, row-level security out of the box |
| AI | Google Gemini API (`gemini-3.6-flash`) | Called directly via REST from a serverless function — no SDK abstraction, so the request/response shape is explicit |
| Serverless functions | Vercel Functions | Keeps the Gemini API key server-side; auto-deployed alongside the frontend, zero extra config |
| Hosting / CD | Vercel | Git-integrated: preview deployment per PR, automatic production deploy on merge to `main` |
| CI | GitHub Actions | Lint + build gate on every push and PR |
| Containerization | Docker (multi-stage) + Compose | Local-dev parity; not the production deploy path (see note below) |

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────────┐
│   Browser    │◀─────▶│  React SPA (Vite)  │◀─────▶│    Supabase      │
│  (client)    │        │  hosted on Vercel  │        │ Postgres + Auth  │
└─────────────┘        └──────────┬─────────┘        └─────────────────┘
                                   │
                                   │ /api/chat (POST)
                                   ▼
                        ┌──────────────────────┐        ┌─────────────┐
                        │ Vercel serverless fn   │◀─────▶│  Gemini API  │
                        │ (api/chat.js)           │        │ (REST)       │
                        └──────────────────────┘        └─────────────┘
```

- The browser never talks to Gemini directly or holds an API key — every chat request goes through the serverless function, which holds `GEMINI_API_KEY` as a server-only environment variable.
- Supabase Row Level Security enforces that opportunities are publicly readable but each user's saved/bookmarked items are visible only to them (`auth.uid() = user_id` policies), so authorization isn't re-implemented in application code.
- Opportunity data is managed directly in Supabase (Table Editor or CSV import) rather than through a custom admin panel — a deliberate scope cut for an early-stage MVP with low listing-update frequency.
- Gemini 3.x models "think" before answering, and by default that reasoning shares the same output token budget as the visible reply — left unchecked, it silently truncates responses. `api/chat.js` sets `thinkingConfig.thinkingLevel: "low"` since this is a short mentor reply, not a deep reasoning task, and filters out any `thought` parts from the response so only the real answer reaches the client.
- Assistant replies may contain light markdown (bold, bullet lists); the chat widget renders it with `react-markdown` rather than displaying raw `**`/`*` characters. User-typed messages are shown as plain text, not parsed as markdown.

## Setup

### 1. Install

```bash
git clone <your-repo-url>
cd techsaarthi
npm install
```

### 2. Configure Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the files in `sql/` in order:
   `01_schema.sql` → `02_seed.sql` → `03_migration_tags_and_deadline.sql`.
3. Under **Authentication → Sign In / Providers → Email**, turn off "Confirm email" for frictionless local testing (re-enable before a real public launch).
4. Under **Project Settings → API Keys**, copy the Project URL and `anon` public key.

### 3. Configure Gemini

1. Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Make sure the key has no application/referrer restriction, since it's called server-to-server.
3. Google retires/renames Flash model IDs every few months. If `/api/chat` starts
   returning a 502 with a Vercel log showing `404 ... no longer available`, the
   error message itself names the replacement — update the model string on the
   `generativelanguage.googleapis.com/v1beta/models/` line in `api/chat.js` and
   redeploy. Current as of this writing: `gemini-3.6-flash`.

### 4. Environment variables

```bash
cp .env.example .env
```

Fill in:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...      # no VITE_ prefix — must stay server-side only
```

### 5. Run locally

```bash
npm run dev              # frontend only, at localhost:5173
```

The chatbot needs the serverless function too, which plain `vite dev` doesn't run. Use the Vercel CLI for full local parity:

```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
vercel dev               # frontend + /api together
```

### 6. Bulk-adding opportunities

Fill `data-templates/opportunities_template.csv` (Google Sheets or Excel), export as CSV, then in Supabase: **Table Editor → opportunities → Insert → Import data from CSV**. No SQL or custom form required.

### 7. Deploy

Push to GitHub, import the repo into Vercel, add the three environment variables above under **Project Settings → Environment Variables**, deploy. `api/chat.js` is picked up automatically as a serverless function alongside the static build.

### 8. Optional: Docker

```bash
docker compose up --build
```

Serves the static frontend at `localhost:8080` via nginx. Note: this container doesn't include the serverless function, so the chatbot won't work in this mode — it's intended for local-dev/build parity, not as the production deploy path (that's Vercel).

## Day 4 — Community contributions (submissions + blog)

Students can now suggest opportunities and publish "what it was actually
like" stories, both gated behind a manual review queue — nothing goes live
without you approving it first.

### 1. Run the migration

In Supabase SQL Editor, run `sql/04_contributions.sql`. This creates two
tables (`submitted_opportunities`, `posts`) with RLS policies, and a helper
function `approve_submission(id)` that copies an approved submission
straight into the live `opportunities` table in one step.

### 2. What's new in the app

- **`/dashboard/contribute`** (protected) — two tabs: "Suggest an
  opportunity" (feeds `submitted_opportunities`) and "Share your experience"
  (feeds `posts`, markdown supported, with an anonymous toggle and optional
  LinkedIn). Both show the submitter their own past submissions and status.
- **`/blog`** and **`/blog/:id`** — public, no login required, listing only
  `status = 'published'` posts. This is meant to be shared and found, so it's
  intentionally outside the `/dashboard` auth wall.
- Footer and dashboard navbar link to both; footer also has an Instagram spot
  (`INSTAGRAM_URL` constant at the top of `Footer.jsx` — currently a
  placeholder, put your real handle in once you're ready to link it
  prominently).

### 3. Reviewing submissions (your workflow, no admin UI needed)

In Supabase SQL Editor:
```sql
-- See what's waiting
select id, title, organization, submitter_note from submitted_opportunities where status = 'pending';
select id, title, author_display_name, is_anonymous from posts where status = 'pending';

-- Approve an opportunity (copies it into the live opportunities table)
select approve_submission('paste-the-id-here');

-- Reject an opportunity
update submitted_opportunities set status = 'rejected', reviewed_at = now() where id = '...';

-- Publish a story
update posts set status = 'published', published_at = now() where id = '...';

-- Reject a story
update posts set status = 'rejected' where id = '...';
```

### 4. Content policy (worth writing down before this gets real traffic)

Nothing technical enforces this — it's a review-time judgment call, but
worth deciding on now rather than mid-review: don't publish anything naming
a specific interviewer negatively, don't publish confidential interview
questions if a company's process is under NDA, and anonymous doesn't mean
unmoderated — the same review bar applies either way.

## Outcomes / scope achieved

- **Full auth-to-discovery flow shipped solo**, end to end: signup → login → protected dashboard → category browsing → save/bookmark → AI assistant, in an initial 3-day build window.
- **4 opportunity categories**, backed by a relational schema (`opportunities`, `saved_opportunities`) with row-level security enforced at the database layer rather than in application logic.
- **Bulk-import pipeline** replacing manual entry, taking data-entry cost from *one row at a time* to *one CSV import per batch of any size* — the design constraint that scales this from a 15-listing demo to hundreds of real listings without added engineering work.
- **Community contribution loop**: students can suggest opportunities and publish experience posts, both behind a manual moderation queue — turns the platform from single-maintainer to community-sourced without giving up editorial control.
- **Zero client-exposed secrets**: both the database (via RLS + a public anon key) and the LLM (via a server-side-only key in a serverless proxy) are safe to ship to a public repo.
- **CI gate on every PR** (lint + production build) via GitHub Actions; **automatic preview + production deploys** via Vercel's git integration — a working CI/CD pipeline, not a manual deploy process.

## Roadmap

Deliberately out of scope for the MVP, in rough priority order:
- Smart filtering (year, eligibility, domain) on the opportunity list pages
- Weekly digest of high-impact opportunities
- Resume analysis / skill-gap detection
- A real in-app moderation view for submissions/posts (currently: SQL Editor queries — fine at low volume, worth building once review volume grows)
- Automated tests (unit tests for the deadline-formatting logic and RLS policies would be the first additions)
