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