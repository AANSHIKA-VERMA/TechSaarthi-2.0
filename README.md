# TechSaarthi

**A guided discovery platform for tech opportunities — built for women BTech students to find internships, scholarships, hackathons, and leadership programs in one place, instead of forty scattered tabs.**

Live: [techsaarthi.vercel.app](https://techsaarthi.vercel.app)

---

## The problem

Opportunities for early-career women in tech — internships, scholarships, hackathons, fellowships — exist, but discovery is broken: they're scattered across WhatsApp forwards, stale PDFs, and portals nobody checks regularly. Talented students miss deadlines they'd have easily qualified for, not from lack of skill but from lack of visibility. TechSaarthi centralizes verified opportunities into one browsable, bookmarkable, guided experience — with an AI assistant on hand for eligibility questions and encouragement.

## Features

- **Auth-gated dashboard** — email/password signup and login, protected client-side routing
- **Opportunity discovery** — four categories (internships, scholarships, hackathons, leadership programs), each showing live counts pulled from the database
- **Structured listings** — every opportunity carries organization, deadline (or a flexible free-text status like "Rolling admissions" for open-ended ones), tags, an apply link, an optional reference video, and a link to a full external brief
- **Save / bookmark** — one-click save on any listing, with a dedicated page showing everything a user has bookmarked across all categories
- **AI assistant** — a chat widget answering career and eligibility questions, plus a "Motivate Me" action that returns a short, specific, non-generic encouragement message
- **Bulk data entry** — opportunities are managed via CSV import into the database rather than a custom admin UI, so hundreds of listings can be added in one pass without hand-building forms

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast dev loop, small production bundle |
| Styling | Tailwind CSS v4 | Utility-first, no separate design-system build |
| Routing | React Router | Client-side routing with auth-protected routes |
| Auth + Database | Supabase (Postgres + Auth) | Managed auth, relational data, row-level security out of the box |
| AI | Google Gemini API (`gemini-2.5-flash`) | Called directly via REST from a serverless function — no SDK abstraction, so the request/response shape is explicit |
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

## Outcomes / scope achieved

- **Full auth-to-discovery flow shipped solo**, end to end: signup → login → protected dashboard → category browsing → save/bookmark → AI assistant, in an initial 3-day build window.
- **4 opportunity categories**, backed by a relational schema (`opportunities`, `saved_opportunities`) with row-level security enforced at the database layer rather than in application logic.
- **Bulk-import pipeline** replacing manual entry, taking data-entry cost from *one row at a time* to *one CSV import per batch of any size* — the design constraint that scales this from a 15-listing demo to hundreds of real listings without added engineering work.
- **Zero client-exposed secrets**: both the database (via RLS + a public anon key) and the LLM (via a server-side-only key in a serverless proxy) are safe to ship to a public repo.
- **CI gate on every PR** (lint + production build) via GitHub Actions; **automatic preview + production deploys** via Vercel's git integration — a working CI/CD pipeline, not a manual deploy process.
- **Production bundle**: ~470 KB JS / ~135 KB gzipped for the full authenticated app (dashboard, opportunity lists, saved page, chat widget) — no code-splitting yet, noted as a follow-up optimization.

## Future Scope

- Smart filtering (year, eligibility, domain) on the opportunity list pages
- Weekly digest of high-impact opportunities
- Resume analysis / skill-gap detection
- Lightweight admin UI (currently: Supabase Table Editor + CSV import)
- Automated tests (unit tests for the deadline-formatting logic and RLS policies would be the first additions)
