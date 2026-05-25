## Day 1 — 2026-05-24

**Hours worked:** 4

**What I did:** Set up the entire project foundation. Initialized a Next.js 14
project with TypeScript, Tailwind CSS, and ESLint. Installed all required
dependencies including Supabase, Resend, and nanoid. Configured shadcn/ui with
the Nova preset and added all required UI components (button, input, label,
card, badge, separator, progress). Set up a public GitHub repository, configured
git identity, and successfully pushed the initial codebase. Added a GitHub
Actions CI workflow that runs lint and tests on every push to main. Created
.env.local with all API keys. Researched and manually verified pricing data for
all 8 required AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, OpenAI API,
Anthropic API, Google Gemini, Windsurf) directly from official vendor pricing
pages and documented them in PRICING_DATA.md with source URLs and verification
dates.

**What I learned:** How to initialize and configure a Next.js project from
scratch. Learned about the shadcn/ui component library and how it differs from
regular npm packages — it copies source files directly into your project rather
than installing as a dependency. Learned how to set up GitHub Actions for
continuous integration. Discovered significant pricing differences across AI
tools — for example Cursor Ultra costs $200/month while Windsurf Pro is just
$20/month for similar coding assistance.

**Blockers / what I'm stuck on:** Anthropic API console kept redirecting to a
payment page with no working skip option. Resolved by choosing Google Gemini API
as the LLM for the AI summary feature instead — the assignment permits any LLM.
Also faced git push errors initially due to missing git identity configuration
and GitHub authentication — resolved by setting git config and using a Personal
Access Token.

**Plan for tomorrow:** Build the spend input form — the first of 6 required MVP
features. Will support all 8 AI tools with plan selection, seat count, and
monthly spend fields. Will implement localStorage persistence so form state
survives page reloads.

## Day 2 — 2026-05-24

**Hours worked:** 8

**What I did:** Built the complete application end-to-end. Created the spend
input form with all 8 AI tools, localStorage persistence, and plan/seat
selection. Built the audit engine with defensible pricing rules for all tools.
Built the audit results page with per-tool breakdown, savings hero numbers,
severity badges, and lead capture form. Integrated Google Gemini API for
AI-generated summaries with graceful fallback. Built shareable audit URLs
with unique slugs stored in Supabase. Set up API routes for leads and audits.
Wrote 7 passing Jest tests for the audit engine. Deployed to Vercel at
https://credex-audit-wges.vercel.app. Wrote README, ARCHITECTURE, GTM,
ECONOMICS, METRICS, LANDING_COPY, PROMPTS, and REFLECTION docs.

**What I learned:** React hooks (useState, useEffect) and how they replace
vanilla JS event listeners. Next.js App Router file-based routing — creating
a folder with page.tsx automatically creates a route. How dynamic routes work
with [slug] folders. That Next.js 15 changed params to be a Promise, breaking
the build on Vercel until I fixed the type. How to set up Jest with ts-jest
for TypeScript projects. The difference between client and server components
in Next.js.

**Blockers / what I'm stuck on:** Resend email integration not yet complete —
the lead form stores emails in Supabase but does not send a confirmation email.
USER_INTERVIEWS.md pending — need to conduct 3 real interviews.

**Plan for tomorrow:** Complete user interviews, finish Resend email
integration, run Lighthouse audit on deployed URL, write USER_INTERVIEWS.md.

## Day 3 — 2026-05-25

**Hours worked:** 8

**What I did:** Conducted 3 real user interviews with classmates — Aditya
(software developer at AppOpen), Abhilash (MCA student, course project), and
Anuska (content creator and small business owner). Wrote USER_INTERVIEWS.md
with full notes from all 3 conversations. Completed Resend email integration —
users now receive a formatted HTML audit report in their inbox after submitting
their email, confirmed working with a real test. Added screenshots to README.md.
Wrote all remaining documentation: PROMPTS.md, REFLECTION.md, LANDING_COPY.md,
METRICS.md, ECONOMICS.md, GTM.md. Tested live deployment at
https://credex-audit-wges.vercel.app end-to-end.

**What I learned:** User interviews revealed the tool has broader appeal than
just developers — content creators and small business owners who pay for AI
tools have the same pain of not tracking spend. Abhilash checked his bank
statement mid-conversation and was surprised by how much he had spent —
a powerful reminder that spend awareness alone is valuable, separate from
optimization. Anuska's use case showed the tool could serve creators and
freelancers, not just engineering teams.

**Blockers / what I'm stuck on:** The 5-day commit requirement was not met.
This is an honest acknowledgement: the entire project was built intensively
over 2 days (May 24–25). The reason is that the days prior to receiving this
assignment were consumed by college mid-term examinations, lab exams, course
project demonstrations, and a research paper submission — all happening
simultaneously in the same week. I had no bandwidth to start earlier. When
I received the assignment I committed fully and built the entire application —
6 MVP features, 7 passing tests, CI, full deployment, all 12 required markdown
files, and 3 real user interviews — in approximately 18 hours of focused work
across 2 days. I understand this affects my discipline score and I accept that
honestly rather than attempting to fake a git history.

**Plan for tomorrow:** Monitor the live deployment, respond to any issues,
continue improving audit engine rules if time permits.

---

## Note on Commit History

This project was built across 2 calendar days (May 24–25, 2026) rather than
the required 5. The reason is honest and documented here: the week prior to
and including the assignment release coincided with my college mid-term
examinations, laboratory exams, mandatory course project demonstrations, and
a research paper submission deadline. These are verifiable academic
commitments that left no time to begin earlier.

When bandwidth became available on May 24, I worked approximately 18 hours
across 2 days to build and ship:
- A complete full-stack Next.js + TypeScript application
- 6 working MVP features including AI integration, Supabase backend, and
  transactional email
- 7 passing automated tests
- A live Vercel deployment
- 12 required markdown files including real user interviews
- Verified pricing data from official vendor pages

I chose to document this honestly rather than manipulate git history, which
the assignment explicitly checks for and rejects. I hope the quality and
completeness of the submission speaks to the effort invested.