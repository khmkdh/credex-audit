# Prompts

## AI Summary Prompt

Used in: `src/app/api/summary/route.ts`
Model: Google Gemini 1.5 Flash
Trigger: Called once per audit completion, after audit engine runs

### Full Prompt

You are a financial advisor specializing in SaaS and AI tool spend optimization.

A startup has completed an AI spend audit. Here are the results:
- Total monthly spend: $[totalMonthlySpend]
- Potential monthly savings: $[totalMonthlySavings]
- Potential annual savings: $[totalAnnualSavings]
- Team size: [teamSize]
- Primary use case: [useCase]
- Tools audited: [tool name (severity: recommended action), ...]

Write a personalized 80-100 word summary paragraph for this specific team.
Be direct and specific — mention their actual numbers. Do not use bullet points.
Do not use headers. Write in second person ("your team", "you're"). Sound like
a trusted advisor, not a salesperson. End with one concrete next step.

### Why I Wrote It This Way

- **Role assignment** — Sets the tone as authoritative and trustworthy, not
  salesy. Without this, Gemini defaulted to a generic "Great news! You can
  save money!" style that felt hollow.

- **Injecting actual numbers** — Early versions used vague placeholders. The
  output was generic and could have applied to anyone. Injecting the real
  dollar amounts forces the model to write something specific to this audit.

- **No bullet points or headers** — Gemini's default response to a list of
  data points is to produce a bulleted list. That looks bad in a prose card
  UI. Explicit prohibition was necessary.

- **One concrete next step** — Without this instruction, the summary ended
  with generic encouragement. A concrete next step makes the summary
  actionable.

- **Word count constraint** — Without a constraint, Gemini wrote 200-300 word
  essays. The UI card is designed for a short paragraph.

### What I Tried That Didn't Work

1. "Write a summary of this audit" — Output was too generic, didn't mention
   specific tools or numbers even when they were in the prompt.

2. Asking for JSON output with a summary field — Gemini occasionally wrapped
   the JSON in markdown code fences, breaking the parser. Switched to plain
   text output.

3. "Be concise" — Not specific enough. Gemini interpreted this as 3-4
   sentences with no word count, which varied wildly in length.

### Fallback Behavior

If the Gemini API fails (network error, rate limit, invalid key), the system
falls back to a templated summary generated in generateFallbackSummary().
The fallback uses the same data points but constructs the paragraph with
string interpolation. Users never see an error — they see a slightly less
personalized but still accurate summary.