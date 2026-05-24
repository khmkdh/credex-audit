# Reflection

## 1. The Hardest Bug I Hit This Week

The hardest bug was the AI summary card not appearing on the audit results
page. The card was conditionally rendered only when `summary` state was
non-empty, but the API call was silently failing and returning an empty
response body — causing a "Unexpected end of JSON input" error that was caught
by the `.catch()` block and swallowed.

My debugging process:
- First hypothesis: the Gemini API key was wrong. Checked `.env.local` —
  key was correct.
- Second hypothesis: the server wasn't reading the env variable. Added a
  `console.log(process.env.GEMINI_API_KEY)` in the route — it printed
  undefined on the first try, then correctly after restarting the dev server.
  Learned that Next.js requires a server restart to pick up new env variables.
- Third hypothesis: the API route was returning an empty body in some edge
  case. Added explicit try/catch around the request body parsing and returned
  a guaranteed JSON response even on error.
- What worked: Wrapping the entire route in defensive error handling so it
  always returns valid JSON, and showing a "Generating personalized
  insight..." placeholder while the summary loads so the UI never looks broken.

## 2. A Decision I Reversed Mid-Week

I initially planned to use the Anthropic API for the AI summary feature since
the assignment recommended it. I spent time setting up the Anthropic console
account and attempting to get API access.

I reversed this decision when the Anthropic console kept redirecting to a
payment page with no working skip option, and their support team confirmed
that free credits are only available for AI safety researchers — not student
projects.

I switched to Google Gemini API, which offers a genuine free tier with 1,500
requests per day and no credit card required. The assignment explicitly says
"or any LLM" so this was a valid choice. I documented the switch in DEVLOG.md
on Day 1. In retrospect this was the right call — Gemini's free tier is more
than sufficient for this use case and removed a blocker that would have cost
real money.

## 3. What I Would Build in Week 2

If I had a second week I would prioritize:

1. **Resend email integration** — The lead capture form currently stores emails
   in Supabase but does not send a transactional email. I would complete the
   Resend integration to send a formatted audit report to the user's email,
   which is required by the assignment and increases trust.

2. **Benchmark mode** — "Your AI spend per developer is $X — companies your
   size average $Y." This requires aggregating audit data across users and
   showing relative positioning. It dramatically increases the shareability
   of results.

3. **PDF export** — A downloadable PDF of the audit report that users can
   share with their CFO or CEO. This is the most-requested feature in B2B
   tools of this type.

4. **Referral codes** — Share the tool with a referral code, both parties get
   a perk (e.g. priority Credex consultation). This creates a viral loop.

5. **More audit rules** — The current engine has rules for 8 tools but many
   edge cases are handled by the default "optimal" fallback. Week 2 would
   add more granular rules for API usage patterns, multi-tool redundancy
   detection, and usage-based recommendations.

## 4. How I Used AI Tools

**Tools used:** Claude (claude.ai) for the majority of code generation and
architecture decisions.

**What I used AI for:**
- Generating boilerplate React components (SpendForm, audit results page)
- Writing TypeScript types and interfaces
- Debugging error messages by pasting them into Claude
- Drafting the markdown documentation files
- Suggesting the Jest test structure

**What I didn't trust AI with:**
- The audit engine logic — I reviewed every pricing rule manually and
  verified each number against official vendor pricing pages
- The ECONOMICS.md math — I built the unit economics myself and used AI
  only to check my reasoning
- The USER_INTERVIEWS.md — these are real conversations I had; AI cannot
  fabricate genuine human insights

**One specific time AI was wrong and I caught it:**
Claude initially suggested using `params.slug` directly in the Next.js dynamic
route handler. This caused a TypeScript build error on Vercel because Next.js
15 changed `params` to be a Promise that must be awaited. Claude's training
data predated this change. I caught it when the Vercel build failed, read the
error message carefully, and fixed it by changing the type to
`Promise<{ slug: string }>` and awaiting params before use.

## 5. Self-Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Started strong on Day 1 and worked consistently, but some features like the email sending via Resend were not completed |
| Code quality | 7/10 | TypeScript used throughout, components are reasonably clean, but some error handling could be more robust |
| Design sense | 6/10 | The UI is functional and uses a consistent design system (shadcn/ui + Tailwind) but lacks the visual polish of a truly product-ready tool |
| Problem solving | 8/10 | Debugged multiple non-obvious issues (env variables, Next.js 15 params, Jest configuration) by forming hypotheses and testing them systematically |
| Entrepreneurial thinking | 7/10 | Wrote substantive GTM, ECONOMICS, and METRICS docs with real numbers and specific channels, not generic advice |