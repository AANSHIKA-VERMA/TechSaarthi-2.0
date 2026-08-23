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
- **AI mentor** — a chat widget that acts as a career mentor: asks a clarifying question when it doesn't know enough about the student (year, interest area, what she's looking for), then gives concrete, platform-grounded next steps rather than generic advice. "Motivate Me" opens the same mentor persona rather than a separate canned-response mode.
- **Bulk data entry** — opportunities are managed via CSV import into the database rather than a custom admin UI, so hundreds of listings can be added in one pass without hand-building forms
- **Community contributions (submissions + blog)** — Students can suggest opportunities and publish "what it was actually
like" stories, both gated behind a manual review queue — nothing goes live without approving.

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


## Outcomes / scope achieved

- **Full auth-to-discovery flow shipped solo**, end to end: signup → login → protected dashboard → category browsing → save/bookmark → AI assistant, in an initial 3-day build window.
- **4 opportunity categories**, backed by a relational schema (`opportunities`, `saved_opportunities`) with row-level security enforced at the database layer rather than in application logic.
- **Bulk-import pipeline** replacing manual entry, taking data-entry cost from *one row at a time* to *one CSV import per batch of any size* — the design constraint that scales this from a 15-listing demo to hundreds of real listings without added engineering work.
- **Community contribution loop**: students can suggest opportunities and publish experience posts, both behind a manual moderation queue — turns the platform from single-maintainer to community-sourced without giving up editorial control.
- **Zero client-exposed secrets**: both the database (via RLS + a public anon key) and the LLM (via a server-side-only key in a serverless proxy) are safe to ship to a public repo.
- **CI gate on every PR** (lint + production build) via GitHub Actions; **automatic preview + production deploys** via Vercel's git integration — a working CI/CD pipeline, not a manual deploy process.

---
## Made with ♥ by Aanshika Verma, for fellow students.
Let's explore tech together 🚀
