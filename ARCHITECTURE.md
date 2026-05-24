# Architecture

## System Diagram

```mermaid
graph TD
    A[User - Browser] -->|Fills form| B[SpendForm Component]
    B -->|Saves to| C[localStorage]
    B -->|Submits| D[/audit page]
    D -->|Reads from| C
    D -->|runAudit| E[Audit Engine - Pure TS]
    E -->|Returns AuditResult| D
    D -->|POST /api/audits| F[Supabase - audits table]
    F -->|Returns slug| D
    D -->|POST /api/summary| G[Gemini API]
    G -->|Returns summary text| D
    D -->|User submits email| H[POST /api/leads]
    H -->|Stores lead| I[Supabase - leads table]
    J[Shared URL /audit/slug] -->|GET /api/audits/slug| F
    F -->|Returns audit data| J
```

## Data Flow

1. User fills the spend input form on `/`
2. Form state is saved to `localStorage` on every change (persistence across reloads)
3. On submit, user is navigated to `/audit`
4. `/audit` reads form state from `localStorage` and runs `runAudit()` — a pure TypeScript function with no API calls
5. Simultaneously, two async calls fire in parallel:
   - `POST /api/audits` — saves the audit to Supabase, returns a unique slug
   - `POST /api/summary` — sends audit data to Gemini API, returns a personalized paragraph
6. The shareable URL is constructed from the slug and shown to the user
7. If user submits email, `POST /api/leads` saves it to Supabase

## Why This Stack

- **Next.js App Router** — API routes and pages in one project, no separate backend needed
- **TypeScript** — Catches type errors at compile time, especially important for the audit engine math
- **Supabase** — Managed Postgres with RLS, REST API, and free tier. No server to manage.
- **Gemini 1.5 Flash** — Free tier (1,500 req/day), fast (~1s), good instruction following for summary generation
- **Tailwind + shadcn/ui** — Rapid UI development without writing custom CSS. shadcn copies components into the project so they're fully customizable.
- **Vercel** — Zero-config Next.js deployment, automatic preview deployments on every push

## Scaling to 10,000 Audits/Day

1. **Audit engine** — Already stateless and pure. Can run on edge functions with no changes.
2. **Database** — Supabase scales vertically; at 10k audits/day (~7 audits/minute) the free tier would be insufficient. Would upgrade to Supabase Pro ($25/mo) or move to PlanetScale for better connection pooling.
3. **Gemini API** — Free tier allows 1,500 req/day. At 10k audits/day, would need a paid Gemini plan or implement a queue with rate limiting.
4. **Lead storage** — Add an index on `email` column to speed up deduplication checks.
5. **Caching** — Add Redis (Upstash free tier) to cache audit results by slug so repeated views don't hit Supabase.
6. **CDN** — Static assets already served via Vercel's CDN. No changes needed.