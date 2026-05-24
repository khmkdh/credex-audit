import { describe, test, expect } from "@jest/globals";
import { runAudit } from "@/lib/audit";
import { FormState } from "@/lib/tools";

// Test 1: Cursor Teams with 2 users should flag overspending
test("Cursor Teams plan with 2 seats should recommend Individual Pro", () => {
  const form: FormState = {
    teamSize: 2,
    useCase: "coding",
    tools: [
      {
        toolId: "cursor",
        planId: "teams",
        seats: 2,
        monthlySpend: 80,
      },
    ],
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.monthlySavings).toBeGreaterThan(0);
  expect(rec.recommendedAction).toContain("Individual Pro");
});

// Test 2: GitHub Copilot Enterprise with small team should flag overspending
test("GitHub Copilot Enterprise with team < 10 should recommend Business plan", () => {
  const form: FormState = {
    teamSize: 5,
    useCase: "coding",
    tools: [
      {
        toolId: "github_copilot",
        planId: "enterprise",
        seats: 5,
        monthlySpend: 195,
      },
    ],
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.monthlySavings).toBe(100);
  expect(rec.annualSavings).toBe(1200);
});

// Test 3: Already optimal plan should return optimal severity
test("Free plan should be marked as optimal", () => {
  const form: FormState = {
    teamSize: 1,
    useCase: "mixed",
    tools: [
      {
        toolId: "chatgpt",
        planId: "free",
        seats: 1,
        monthlySpend: 0,
      },
    ],
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("optimal");
  expect(rec.monthlySavings).toBe(0);
});

// Test 4: Total savings calculation should be sum of all tool savings
test("Total monthly savings should equal sum of individual tool savings", () => {
  const form: FormState = {
    teamSize: 5,
    useCase: "coding",
    tools: [
      {
        toolId: "cursor",
        planId: "teams",
        seats: 2,
        monthlySpend: 80,
      },
      {
        toolId: "github_copilot",
        planId: "enterprise",
        seats: 5,
        monthlySpend: 195,
      },
    ],
  };
  const result = runAudit(form);
  const sumOfSavings = result.recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  expect(result.totalMonthlySavings).toBe(sumOfSavings);
});

// Test 5: Annual savings should be 12x monthly savings
test("Annual savings should be exactly 12x monthly savings", () => {
  const form: FormState = {
    teamSize: 5,
    useCase: "coding",
    tools: [
      {
        toolId: "github_copilot",
        planId: "enterprise",
        seats: 5,
        monthlySpend: 195,
      },
    ],
  };
  const result = runAudit(form);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// Test 6: Overspending tools should produce savings greater than zero
test("Multiple overspending tools should produce total savings greater than zero", () => {
  const form: FormState = {
    teamSize: 5,
    useCase: "coding",
    tools: [
      {
        toolId: "cursor",
        planId: "teams",
        seats: 2,
        monthlySpend: 80,
      },
      {
        toolId: "github_copilot",
        planId: "enterprise",
        seats: 5,
        monthlySpend: 195,
      },
      {
        toolId: "claude",
        planId: "max",
        seats: 5,
        monthlySpend: 500,
      },
    ],
  };
  const result = runAudit(form);
  expect(result.totalMonthlySavings).toBeGreaterThan(0);
  expect(result.isAlreadyOptimal).toBe(false);
});

// Test 7: Claude Max with many seats should recommend Team Standard
test("Claude Max with more than 3 seats should recommend Team Standard", () => {
  const form: FormState = {
    teamSize: 5,
    useCase: "writing",
    tools: [
      {
        toolId: "claude",
        planId: "max",
        seats: 5,
        monthlySpend: 500,
      },
    ],
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});