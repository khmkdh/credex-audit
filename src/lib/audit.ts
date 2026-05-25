import { TOOLS, FormState, ToolEntry } from "./tools";


export type ToolRecommendation = {
  toolId: string;
  toolName: string;
  currentPlanName: string;
  currentMonthlySpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  estimatedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: "overspending" | "optimal" | "consider";
};

export type AuditResult = {
  recommendations: ToolRecommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  isAlreadyOptimal: boolean;
  teamSize: number;
  useCase: string;
};

export function runAudit(formState: FormState): AuditResult {
  const recommendations: ToolRecommendation[] = [];
  let totalMonthlySpend = 0;
  let totalMonthlySavings = 0;

  for (const entry of formState.tools) {
    const tool = TOOLS.find((t) => t.id === entry.toolId);
    if (!tool) continue;

    const currentPlan = tool.plans.find((p) => p.id === entry.planId);
    if (!currentPlan) continue;

    const currentSpend = entry.monthlySpend;
    totalMonthlySpend += currentSpend;

    const rec = evaluateTool(entry, tool.name, currentPlan.name, currentSpend, formState);
    recommendations.push(rec);
    totalMonthlySavings += rec.monthlySavings;
  }

  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings: totalMonthlySavings > 500,
    isAlreadyOptimal: totalMonthlySavings < 10,
    teamSize: formState.teamSize,
    useCase: formState.useCase,
  };
}

function evaluateTool(
  entry: ToolEntry,
  toolName: string,
  currentPlanName: string,
  currentSpend: number,
  formState: FormState
): ToolRecommendation {
  const { toolId, seats } = entry;
  const { teamSize, useCase } = formState;

  // --- Cursor ---
  if (toolId === "cursor") {
    if (entry.planId === "ultra" && useCase !== "coding") {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Downgrade to Pro",
        plan: "Individual Pro",
        cost: 20 * seats,
        reason: `Cursor Ultra ($200/seat) is designed for heavy coding workflows. Your primary use case is ${useCase} — Pro ($20/seat) provides sufficient capability and saves $${(200 - 20) * seats}/month.`,
        severity: "overspending",
      });
    }
    if (entry.planId === "teams" && seats <= 2) {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Switch to Individual Pro",
        plan: "Individual Pro",
        cost: 20 * seats,
        reason: `Teams plan ($40/seat) for ${seats} users costs more than Individual Pro ($20/seat). Teams plan benefits (admin controls, SSO) are unnecessary at this scale.`,
        severity: "overspending",
      });
    }
    if (entry.planId === "pro_plus" && useCase !== "coding") {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Downgrade to Pro",
        plan: "Individual Pro",
        cost: 20 * seats,
        reason: `Pro+ ($60/seat) adds extended context and priority access primarily useful for intensive coding. For ${useCase} work, Pro ($20/seat) is sufficient.`,
        severity: "overspending",
      });
    }
  }

  // --- GitHub Copilot ---
  if (toolId === "github_copilot") {
    if (entry.planId === "enterprise" && teamSize < 10) {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Downgrade to Business",
        plan: "Business",
        cost: 19 * seats,
        reason: `Enterprise ($39/seat) adds policy management and audit logs suited for large orgs. With ${teamSize} team members, Business ($19/seat) covers all practical needs and halves your cost.`,
        severity: "overspending",
      });
    }
    if (entry.planId === "pro_plus" && useCase !== "coding") {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Downgrade to Pro",
        plan: "Individual Pro",
        cost: 10 * seats,
        reason: `Copilot Pro+ ($39/seat) is optimized for coding-heavy workflows with Claude Sonnet access. For ${useCase} use cases, Pro ($10/seat) is adequate.`,
        severity: "overspending",
      });
    }
    if (entry.planId === "business" && seats === 1) {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Switch to Individual Pro",
        plan: "Individual Pro",
        cost: 10,
        reason: `Business plan ($19/seat) is designed for teams with admin controls and org-wide policies. As a solo user, Individual Pro ($10/month) gives identical AI features at nearly half the price.`,
        severity: "overspending",
      });
    }
  }

  // --- Claude ---
  if (toolId === "claude") {
    if (entry.planId === "team_premium" && teamSize < 5) {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Switch to Team Standard",
        plan: "Team Standard",
        cost: 20 * seats,
        reason: `Team Premium ($100/seat) includes Max-level usage limits. For a team of ${teamSize}, Team Standard ($20/seat) provides sufficient capacity for most workflows.`,
        severity: "overspending",
      });
    }
    if (entry.planId === "max" && seats > 3) {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Switch to Team Standard",
        plan: "Team Standard",
        cost: 20 * seats,
        reason: `Max ($100/seat) for ${seats} users costs $${100 * seats}/month. Team Standard ($20/seat) covers collaborative use at $${20 * seats}/month — saving $${(100 - 20) * seats}/month without meaningful capability loss for teams.`,
        severity: "overspending",
      });
    }
  }

  // --- ChatGPT ---
  if (toolId === "chatgpt") {
    if (entry.planId === "pro" && useCase === "coding") {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Switch to a coding-focused tool",
        plan: "Cursor Pro or GitHub Copilot Pro",
        cost: currentSpend * 0.5,
        reason: `ChatGPT Pro (₹10,699/month) is a general-purpose tool. For coding workflows, Cursor Pro ($20/seat) or GitHub Copilot Pro ($10/seat) offer deeper IDE integration and code-specific features at a fraction of the cost.`,
        severity: "consider",
      });
    }
  }

  // --- API tools (OpenAI / Anthropic direct) ---
  if (toolId === "openai_api" || toolId === "anthropic_api") {
    if (currentSpend > 200 && useCase !== "data") {
      const altTool = toolId === "openai_api" ? "Claude Team Standard ($20/seat)" : "ChatGPT Plus (₹1,999/month)";
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Evaluate flat-rate plan",
        plan: altTool,
        cost: currentSpend * 0.6,
        reason: `At $${currentSpend}/month on API direct, a flat-rate subscription may be more predictable and cheaper. ${altTool} offers comparable capability with no usage spikes.`,
        severity: "consider",
      });
    }
  }

  // --- Windsurf ---
  if (toolId === "windsurf") {
    if (entry.planId === "max" && useCase !== "coding") {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Downgrade to Pro",
        plan: "Pro",
        cost: 20 * seats,
        reason: `Windsurf Max ($200/seat) is built for power coding users needing unlimited AI flows. For ${useCase} work, Pro ($20/seat) is more than sufficient.`,
        severity: "overspending",
      });
    }
    if (entry.planId === "teams" && seats <= 2) {
      return makeRec(toolId, toolName, currentPlanName, currentSpend, {
        action: "Switch to Individual Pro",
        plan: "Pro",
        cost: 20 * seats,
        reason: `Teams plan ($40/seat) for ${seats} users adds admin features you likely don't need. Individual Pro ($20/seat) saves $${(40 - 20) * seats}/month.`,
        severity: "overspending",
      });
    }
  }

  // Default — already optimal
  return makeRec(toolId, toolName, currentPlanName, currentSpend, {
    action: "No change needed",
    plan: currentPlanName,
    cost: currentSpend,
    reason: `Your current ${toolName} plan appears well-matched to your team size (${teamSize}) and use case (${useCase}). No immediate optimization identified.`,
    severity: "optimal",
  });
}

function makeRec(
  toolId: string,
  toolName: string,
  currentPlanName: string,
  currentSpend: number,
  rec: {
    action: string;
    plan: string;
    cost: number;
    reason: string;
    severity: "overspending" | "optimal" | "consider";
  }
): ToolRecommendation {
  const savings = Math.max(0, currentSpend - rec.cost);
  return {
    toolId,
    toolName,
    currentPlanName,
    currentMonthlySpend: currentSpend,
    recommendedAction: rec.action,
    recommendedPlan: rec.plan,
    estimatedMonthlyCost: rec.cost,
    monthlySavings: savings,
    annualSavings: savings * 12,
    reason: rec.reason,
    severity: rec.severity,
  };
}