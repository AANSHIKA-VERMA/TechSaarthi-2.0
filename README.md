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

## Future Scope

- Smart filtering (year, eligibility, domain) on the opportunity list pages
- Weekly digest of high-impact opportunities
- Resume analysis / skill-gap detection
- Lightweight admin UI (currently: Supabase Table Editor + CSV import)
- Automated tests (unit tests for the deadline-formatting logic and RLS policies would be the first additions)
