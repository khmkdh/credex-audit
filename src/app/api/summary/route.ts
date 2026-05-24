import { NextRequest, NextResponse } from "next/server";
import { AuditResult } from "@/lib/audit";

function generateFallbackSummary(audit: AuditResult): string {
  const { totalMonthlySpend, totalMonthlySavings, totalAnnualSavings, recommendations } = audit;
  const overspending = recommendations.filter((r) => r.severity === "overspending");
  const toolNames = overspending.map((r) => r.toolName).join(", ");

  if (totalMonthlySavings < 10) {
    return `Your AI tool stack looks well-optimized. You're spending $${totalMonthlySpend.toFixed(0)}/month across ${recommendations.length} tool${recommendations.length > 1 ? "s" : ""}, and our audit found no significant overspend. Keep an eye on usage as your team grows — plan mismatches tend to appear when headcount changes.`;
  }

  return `Your team is spending $${totalMonthlySpend.toFixed(0)}/month on AI tools, but our audit identified $${totalMonthlySavings.toFixed(0)}/month in unnecessary spend — that's $${totalAnnualSavings.toFixed(0)} per year. The biggest opportunities are with ${toolNames || "your current plans"}. These aren't minor tweaks: switching to right-sized plans means the same capability for less, with no workflow disruption.`;
}

export async function POST(req: NextRequest) {
  try {
    const { auditResult }: { auditResult: AuditResult } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        summary: generateFallbackSummary(auditResult),
        source: "fallback",
      });
    }

    const prompt = `You are a financial advisor specializing in SaaS and AI tool spend optimization.

A startup has completed an AI spend audit. Here are the results:
- Total monthly spend: $${auditResult.totalMonthlySpend.toFixed(0)}
- Potential monthly savings: $${auditResult.totalMonthlySavings.toFixed(0)}
- Potential annual savings: $${auditResult.totalAnnualSavings.toFixed(0)}
- Team size: ${auditResult.teamSize}
- Primary use case: ${auditResult.useCase}
- Tools audited: ${auditResult.recommendations.map((r) => `${r.toolName} (${r.severity}: ${r.recommendedAction})`).join(", ")}

Write a personalized 80-100 word summary paragraph for this specific team. Be direct and specific — mention their actual numbers. Do not use bullet points. Do not use headers. Write in second person ("your team", "you're"). Sound like a trusted advisor, not a salesperson. End with one concrete next step.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) throw new Error("Gemini API error");

    const data = await response.json();
    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      generateFallbackSummary(auditResult);

    return NextResponse.json({ summary, source: "gemini" });
  } catch (err) {
    console.error("Summary generation error:", err);
    return NextResponse.json({
      summary: generateFallbackSummary({ ...({} as AuditResult) }),
      source: "fallback",
    });
  }
}