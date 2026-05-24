# Metrics

## North Star Metric

**Qualified leads generated per week** — defined as email captures from audits
showing more than $100/month in potential savings.

Why this and not DAU or total audits: This tool is a B2B lead-generation asset.
A user who completes an audit but has no savings potential is not a Credex
customer. A user who sees $500/month in savings and gives their email is. The
North Star must reflect business value, not vanity engagement.

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate**
- Definition: % of users who land on the home page and click "Run My Free Audit"
- Target: >55%
- Why it matters: If users drop off before completing the form, no leads are
  generated regardless of how good the audit engine is
- How to improve: Reduce form friction, add social proof, improve hero copy

**2. Email capture rate**
- Definition: % of users who complete an audit and then submit their email
- Target: >20%
- Why it matters: Direct driver of the North Star — no email = no lead
- How to improve: Show savings number prominently before the email gate,
  improve CTA copy, add trust signals

**3. High-savings audit rate**
- Definition: % of completed audits that show >$100/month in savings
- Target: >40%
- Why it matters: Only high-savings audits generate qualified Credex leads.
  Low-savings audits still capture emails but convert to purchases at ~5x
  lower rate
- How to improve: Improve audit engine to surface more real savings,
  target users more likely to be overspending (larger teams, more tools)

## What to Instrument First

1. **Audit completions** — fire an event when user lands on /audit with a
   valid result. This is the single most important funnel step.
2. **Email captures** — fire an event when lead form is submitted successfully
3. **Savings distribution** — log the savings bucket ($0, $1-100, $100-500,
   $500+) for every audit to understand the user population
4. **Shareable URL clicks** — track how many shared URLs get opened to measure
   viral coefficient
5. **Consultation bookings** — track clicks on the Credex CTA button

Tools: Plausible Analytics (privacy-friendly, $9/mo) or a simple Supabase
events table for zero cost.

## What Number Triggers a Pivot Decision

If after 30 days and 200+ audit completions:
- Email capture rate is below 10% → the value proposition is not landing.
  Pivot: redesign the results page, test different savings presentation
- High-savings audit rate is below 20% → the audit engine is too conservative
  or we're attracting the wrong users. Pivot: retarget to larger teams,
  increase audit engine sensitivity
- Zero consultation bookings despite high-savings audits → the Credex CTA is
  not converting. Pivot: change CTA copy, add social proof, offer a specific
  incentive for booking

A pivot is not warranted if traffic is low but conversion rates are healthy —
that is a distribution problem, not a product problem.