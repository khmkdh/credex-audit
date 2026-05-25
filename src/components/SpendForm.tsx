"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, USE_CASES, FormState, ToolEntry, UseCase } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "credex_audit_form";

const defaultForm: FormState = {
  teamSize: 1,
  useCase: "mixed",
  tools: [],
};

export default function SpendForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Promise.resolve().then(() => {
          setForm(parsed);
          setSelectedToolIds(parsed.tools.map((t: ToolEntry) => t.toolId));
        });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  function toggleTool(toolId: string) {
    if (selectedToolIds.includes(toolId)) {
      setSelectedToolIds((prev) => prev.filter((id) => id !== toolId));
      setForm((prev) => ({
        ...prev,
        tools: prev.tools.filter((t) => t.toolId !== toolId),
      }));
    } else {
      const tool = TOOLS.find((t) => t.id === toolId)!;
      const defaultPlan = tool.plans[0];
      setSelectedToolIds((prev) => [...prev, toolId]);
      setForm((prev) => ({
        ...prev,
        tools: [
          ...prev.tools,
          {
            toolId,
            planId: defaultPlan.id,
            seats: 1,
            monthlySpend: defaultPlan.pricePerSeat,
          },
        ],
      }));
    }
  }

  function updateToolEntry(toolId: string, field: keyof ToolEntry, value: string | number) {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.map((t) =>
        t.toolId === toolId ? { ...t, [field]: value } : t
      ),
    }));
  }

  function handlePlanChange(toolId: string, planId: string) {
    const tool = TOOLS.find((t) => t.id === toolId)!;
    const plan = tool.plans.find((p) => p.id === planId)!;
    const entry = form.tools.find((t) => t.toolId === toolId)!;
    const newSpend = plan.pricePerSeat === -1 ? entry.monthlySpend : plan.pricePerSeat * entry.seats;
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.map((t) =>
        t.toolId === toolId ? { ...t, planId, monthlySpend: newSpend } : t
      ),
    }));
  }

  function handleSubmit() {
    if (form.tools.length === 0) {
      alert("Please select at least one AI tool.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    router.push("/audit");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">SpendSmart AI</h1>
            <p className="text-xs text-slate-600">Free AI spend audit by Credex</p>
          </div>
          <Badge variant="secondary">Free Tool</Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Are you overspending on AI tools?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enter what you pay for AI tools today. Get an instant audit showing
            exactly where you&apos;re overspending and how much you could save.
          </p>
        </div>

        {/* Team Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">About your team</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team size</Label>
              <Input
                id="teamSize"
                type="number"
                min={1}
                max={10000}
                value={form.teamSize}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    teamSize: parseInt(e.target.value) || 1,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="useCase">Primary use case</Label>
              <select
                id="useCase"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.useCase}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    useCase: e.target.value as UseCase,
                  }))
                }
              >
                {USE_CASES.map((uc) => (
                  <option key={uc.id} value={uc.id}>
                    {uc.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tool Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Which AI tools do you pay for?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Select all that apply. You can add spend details below.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOOLS.map((tool) => {
              const selected = selectedToolIds.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  aria-pressed={selected}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool Details */}
        {form.tools.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Tell us about each tool
            </h3>
            {form.tools.map((entry) => {
              const tool = TOOLS.find((t) => t.id === entry.toolId)!;
              return (
                <Card key={entry.toolId}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">{tool.name}</h4>
                      <button
                        onClick={() => toggleTool(entry.toolId)}
                        aria-label={`Remove ${tool.name}`}
                        className="text-xs text-slate-500 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Plan */}
                      <div className="space-y-2">
                        <Label htmlFor={`plan-${entry.toolId}`}>Plan</Label>
                        <select
                          id={`plan-${entry.toolId}`}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                          value={entry.planId}
                          onChange={(e) => handlePlanChange(entry.toolId, e.target.value)}
                        >
                          {tool.plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}{" "}
                              {plan.pricePerSeat > 0
                                ? `(${plan.currency === "INR" ? "₹" : "$"}${plan.pricePerSeat}/${plan.currency === "INR" ? "mo" : "seat"})`
                                : plan.pricePerSeat === 0
                                ? "(Free)"
                                : "(Custom)"}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Seats */}
                      <div className="space-y-2">
                        <Label htmlFor={`seats-${entry.toolId}`}>Number of seats</Label>
                        <Input
                          id={`seats-${entry.toolId}`}
                          type="number"
                          min={1}
                          value={entry.seats}
                          onChange={(e) => {
                            const seats = parseInt(e.target.value) || 1;
                            updateToolEntry(entry.toolId, "seats", seats);
                            const plan = tool.plans.find((p) => p.id === entry.planId)!;
                            if (plan.pricePerSeat >= 0) {
                              updateToolEntry(
                                entry.toolId,
                                "monthlySpend",
                                plan.pricePerSeat * seats
                              );
                            }
                          }}
                        />
                      </div>
                      {/* Monthly Spend */}
                      <div className="space-y-2">
                        <Label htmlFor={`spend-${entry.toolId}`}>Actual monthly spend ($)</Label>
                        <Input
                          id={`spend-${entry.toolId}`}
                          type="number"
                          min={0}
                          value={entry.monthlySpend}
                          onChange={(e) =>
                            updateToolEntry(
                              entry.toolId,
                              "monthlySpend",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Submit */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="px-12 py-6 text-lg bg-blue-600 hover:bg-blue-700"
            disabled={form.tools.length === 0}
          >
            Run My Free Audit →
          </Button>
          <p className="text-xs text-slate-500 mt-3">
            No login required. Results are instant.
          </p>
        </div>
      </main>
    </div>
  );
}