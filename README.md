# TechSaarthi
**Your guide to internships, scholarships, hackathons, and leadership programs — built for women in tech.**

🔗 **Live:** https://techsaarthi.vercel.app/

**React 19 · Vite · Supabase · Gemini API · Vercel · GitHub Actions**

## About

Women BTech students often miss valuable opportunities because information is scattered across WhatsApp groups, PDFs, college notices, and outdated websites. Even after finding an opportunity, students may struggle to understand whether it fits their year, interests, and experience.

**TechSaarthi** brings discovery and guidance together in one platform.

## Key Features

* 🔍 **Opportunity Discovery** — Browse internships, scholarships, hackathons, and leadership programs with deadlines, eligibility, tags, and application links.
* ⭐ **Bookmarks** — Save opportunities and access them from a single personalized page.
* 🧭 **AI Mentor** — Gemini-powered mentor that considers a student's year and interests before suggesting relevant directions.
* 🤝 **Community Contributions** — Students can submit opportunities and share application, interview, or hackathon experiences. Submissions are reviewed before publishing.

The name *TechSaarthi* comes from **Saarthi**, meaning a guide or charioteer — reflecting the platform's goal of helping students find their own path.

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Frontend         | React 19, Vite, Tailwind CSS v4, React Router v7 |
| State            | React Context API                                |
| Backend / Auth   | Supabase Postgres + Auth + RLS                   |
| AI               | Google Gemini API                                |
| Serverless       | Vercel Functions                                 |
| Hosting / CD     | Vercel                                           |
| CI               | GitHub Actions                                   |
| Containerization | Docker + Compose                                 |

The Gemini API key is kept server-side through a Vercel Function and is never exposed to the browser.

## Getting Started

```bash
git clone <this-repo-url>
cd techsaarthi
npm install
npm run dev
```

Configure Supabase using `.env.example` and run the SQL migrations in order. Add `GEMINI_API_KEY` without the `VITE_` prefix.

For local AI endpoint testing, use `vercel dev`.

## Future Plans

* Smart filtering by year, eligibility, and domain
* Weekly opportunity digest
* Resume analysis and skill-gap detection
* Retrieval-grounded AI recommendations
* Moderation dashboard
* Component and E2E testing
* AI endpoint rate limiting

## Contributing

Students can contribute directly through the **Contribute** page by submitting opportunities or sharing experiences. Developers can contribute through issues and pull requests, with GitHub Actions automatically checking lint and build status.

**Built by one student. Growing with the community. 🧡**
## Made with ♥ by Aanshika Verma
