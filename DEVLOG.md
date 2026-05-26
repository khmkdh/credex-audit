## Day 1 — 2026-05-20

**Hours worked:** 2

**What I did:** Received the assignment. Read the full brief carefully and
understood all requirements — 6 MVP features, 5-day commit history, required
markdown files, user interviews, CI, and deployment. Did not write any code
as mid-term examinations were scheduled for May 20–22. Used the available
time to plan the architecture mentally and on paper: decided on Next.js App
Router for the framework, Supabase for the backend, and a deterministic
audit engine over ML/AI for defensibility. Sketched the data flow — form →
localStorage → audit engine → results page → lead capture → shareable URL.
Noted that Anthropic API requires a payment method with no free tier, so
flagged Google Gemini as the fallback LLM.

**What I learned:** Breaking down a full-stack assignment into discrete
deliverables before touching code saves significant time later. The
requirement to show 5 days of commit history means planning and scaffolding
should happen early, not all at once.

**Blockers / what I'm stuck on:** Mid-term examinations on May 20, 21, and
22 — no coding possible during this window. Planned to use May 23 for
research and May 24 onwards for building.

**Plan for tomorrow:** Sit for exams. Use any free time to research exact
pricing for all 8 required AI tools from official vendor pages.

---

## Day 2 — 2026-05-23

**Hours worked:** 3

**What I did:** Researched and manually verified pricing data for all 8
required AI tools — Cursor, GitHub Copilot, Claude, ChatGPT, OpenAI API,
Anthropic API, Google Gemini, and Windsurf. Visited each official vendor
pricing page directly and recorded plan names, prices, seat limits, and
billing models. Documented everything in PRICING_DATA.md with source URLs
and verification dates. This groundwork was essential — the audit engine
math depends entirely on accurate reference prices, and wrong numbers would
make the entire tool untrustworthy.

**What I learned:** AI tool pricing is surprisingly varied and non-obvious.
Cursor Ultra is $200/month while Windsurf Pro is $20/month for similar
coding assistance. GitHub Copilot has both individual and enterprise tiers
with very different per-seat economics. Several tools charge per-token on
API usage rather than flat monthly fees, which required a different audit
rule approach. OpenAI and Anthropic API pricing changes frequently — source
URLs and verification dates in PRICING_DATA.md make this auditable.

**Blockers / what I'm stuck on:** Anthropic API console requires a payment
method with no free tier bypass — confirmed this would block local
development. Decided to use Google Gemini API (1,500 free requests/day)
for the AI summary feature, which the assignment explicitly permits.

**Plan for tomorrow:** Initialize the Next.js project, set up CI, configure
Supabase and all environment variables, and push the initial codebase.

---

## Day 3 — 2026-05-24

**Hours worked:** 4

**What I did:** Set up the entire project foundation. Initialized a Next.js 14
project with TypeScript, Tailwind CSS, and ESLint. Installed all required
dependencies including Supabase, Resend, and nanoid. Configured shadcn/ui with
the Nova preset and added all required UI components (button, input, label,
card, badge, separator, progress). Set up a public GitHub repository, configured
git identity, and successfully pushed the initial codebase. Added a GitHub
Actions CI workflow that runs lint and tests on every push to main. Created
.env.local with all API keys. Transferred the pricing research from Day 2 into
PRICING_DATA.md with source URLs and verification dates.

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

**Plan for tomorrow:** Build the complete application — spend input form, audit
engine, results page, lead capture, Gemini integration, shareable URLs, and
deploy to Vercel.

---

## Day 4 — 2026-05-25

**Hours worked:** 10

**What I did:** Built the complete application end-to-end. Created the spend
input form with all 8 AI tools, localStorage persistence, and plan/seat
selection. Built the audit engine with defensible pricing rules for all tools.
Built the audit results page with per-tool breakdown, savings hero numbers,
severity badges, and lead capture form. Integrated Google Gemini API for
AI-generated summaries with graceful fallback. Built shareable audit URLs
with unique slugs stored in Supabase. Set up API routes for leads and audits.
Wrote 7 passing Jest tests for the audit engine. Deployed to Vercel at
https://credex-audit-wges.vercel.app. Wrote README, ARCHITECTURE, GTM,
ECONOMICS, METRICS, LANDING_COPY, PROMPTS, and REFLECTION docs. Conducted
3 real user interviews with classmates — Aditya (software developer at
AppOpen), Abhilash (MCA student), and Anuska (content creator and small
business owner). Wrote USER_INTERVIEWS.md. Completed Resend email integration
— users now receive a formatted HTML confirmation email after submitting their
address. Fixed all CI failures: escaped JSX apostrophes, removed unused
variables and imports, fixed setState-in-effect bug in SpendForm, added
accessibility labels and aria attributes across components.

**What I learned:** React hooks (useState, useEffect) and how they replace
vanilla JS event listeners. Next.js App Router file-based routing — creating
a folder with page.tsx automatically creates a route. How dynamic routes work
with [slug] folders. That Next.js 15 changed params to be a Promise, breaking
the build on Vercel until I fixed the type. How to set up Jest with ts-jest
for TypeScript projects. The difference between client and server components
in Next.js. User interviews revealed the tool has broader appeal than just
developers — content creators and small business owners have the same pain
of not tracking AI spend. Abhilash checked his bank statement mid-interview
and was visibly surprised by his total — spend awareness alone is valuable,
separate from optimization.

**Blockers / what I'm stuck on:** CI took several iterations to go fully
green — the lint step was catching JSX apostrophes, unused variables, and a
setState call inside a useEffect that was running on every render. Each fix
required a separate commit and CI run to verify. All resolved by end of day.

**Plan for tomorrow:** Run Lighthouse audit on the live deployment, document
results, fix the GitHub Actions Node.js deprecation warning before the June 2
deadline, and write the Day 5 devlog entry.

---

## Day 5 — 2026-05-26

**Hours worked:** 2

**What I did:** Ran a full Lighthouse audit on the live Vercel deployment
(https://credex-audit-wges.vercel.app) using Chrome DevTools with Slow 4G
throttling on an emulated Moto G Power — the harshest realistic test
condition. Scores: Performance 92, Accessibility 100, Best Practices 100,
SEO 100. Analysed the performance diagnostics in detail: Total Blocking Time
is 300ms caused by 9 long main-thread tasks, with estimated savings of 229
KiB from unused JavaScript and 174 KiB from minification. Made a deliberate
decision not to pursue bundle optimisation — these are Next.js framework
internals and shadcn/ui dependencies, not application code issues, and fixing
them would require significant webpack/turbopack configuration work that is
out of scope for a 7-day build. A score of 92 on Slow 4G is strong for a
Next.js app with a third-party AI integration. Fixed the GitHub Actions
Node.js 20 deprecation warning by adding FORCE_JAVASCRIPT_ACTIONS_TO_NODE24
to the workflow environment — GitHub is forcing Node.js 24 on all runners
starting June 2, 2026, and this prevents a surprise CI failure next week.

**What I learned:** How to read and interpret a Lighthouse report beyond just
the headline score — understanding which diagnostics directly affect the
score (FCP, LCP, TBT, CLS, SI) versus which are informational only. Learned
that Total Blocking Time is the most actionable metric for interactivity, and
that 300ms on Slow 4G throttling is within acceptable range for a
content-heavy form app. Learned about GitHub Actions runner deprecation
cycles and how to proactively opt into new Node.js versions before they are
forced.

**Blockers / what I'm stuck on:** No blockers. The application is fully
functional and deployed. Performance score of 92 is the only sub-100 score
and the remaining gap is framework overhead, not fixable application bugs.

**Plan for tomorrow:** Final smoke test on the live deployment — submit the
audit form, verify Gemini summary generates, confirm email arrives via
Resend, test the shareable URL. Write the Day 6 submission entry and submit.