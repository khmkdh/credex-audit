"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormState } from "@/lib/tools";
import { runAudit, AuditResult, ToolRecommendation } from "@/lib/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "credex_audit_form";

function SeverityBadge({ severity }: { severity: ToolRecommendation["severity"] }) {
  if (severity === "overspending")
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overspending</Badge>;
  if (severity === "consider")
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Consider switching</Badge>;
  return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Optimal</Badge>;
}

export default function AuditPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.push("/");
      return;
    }
    try {
      const formState: FormState = JSON.parse(saved);
      const auditResult = runAudit(formState);
      setResult(auditResult);

      // Save audit to DB and get shareable URL
      fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: formState, auditResult }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.slug) {
            setShareUrl(`${window.location.origin}/audit/${data.slug}`);
          }
        })
        .catch(() => {});

      // Generate AI summary
      fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditResult: {
            totalMonthlySpend: auditResult.totalMonthlySpend,
            totalMonthlySavings: auditResult.totalMonthlySavings,
            totalAnnualSavings: auditResult.totalAnnualSavings,
            teamSize: auditResult.teamSize,
            useCase: auditResult.useCase,
            recommendations: auditResult.recommendations,
            isHighSavings: auditResult.isHighSavings,
            isAlreadyOptimal: auditResult.isAlreadyOptimal,
          },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log("Summary API response:", data);
          setSummary(data.summary || "");
        })
        .catch((err) => console.error("Summary error:", err));

    } catch {
      router.push("/");
    }
  }, [router]);

  async function handleLeadSubmit() {
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          role,
          monthlySavings: result?.totalMonthlySavings,
          annualSavings: result?.totalAnnualSavings,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Calculating your audit...</p>
      </div>
    );
  }

  const savingsColor = result.totalMonthlySavings > 500
    ? "text-green-600"
    : result.totalMonthlySavings > 100
    ? "text-yellow-600"
    : "text-slate-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">SpendSmart AI</h1>
            <p className="text-xs text-slate-500">Free AI spend audit by Credex</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            ← Edit inputs
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero savings */}
        <div className="text-center mb-12">
          <p className="text-slate-500 mb-2 text-sm uppercase tracking-wide font-medium">
            Your AI Spend Audit
          </p>
          {result.isAlreadyOptimal ? (
            <>
              <h2 className="text-4xl font-bold text-green-600 mb-3">
                You're spending well ✓
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Based on your team size and use case, your current AI tool spend
                looks optimized. We found less than $10/month in potential savings.
              </p>
            </>
          ) : (
            <>
              <h2 className={`text-5xl font-bold mb-3 ${savingsColor}`}>
                ${result.totalMonthlySavings.toFixed(0)}/mo
              </h2>
              <p className="text-xl text-slate-600 mb-1">in potential monthly savings</p>
              <p className="text-3xl font-semibold text-slate-800">
                ${result.totalAnnualSavings.toFixed(0)} saved per year
              </p>
            </>
          )}
        </div>

        {/* AI Summary */}
        {summary ? (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-blue-500 font-medium mb-2">
                AI-generated insight
              </p>
              <p className="text-blue-900 leading-relaxed">{summary}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-slate-200 bg-slate-50">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-slate-400 font-medium mb-2">
                AI-generated insight
              </p>
              <p className="text-slate-400 italic text-sm">Generating personalized insight...</p>
            </CardContent>
          </Card>
        )}

        {/* Share URL */}
        {shareUrl && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Share this audit
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-md border border-input px-3 py-2 text-sm bg-slate-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Link copied!");
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Spend summary */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-slate-900">
                ${result.totalMonthlySpend.toFixed(0)}
              </p>
              <p className="text-sm text-slate-500 mt-1">Current monthly spend</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className={`text-2xl font-bold ${savingsColor}`}>
                ${result.totalMonthlySavings.toFixed(0)}
              </p>
              <p className="text-sm text-slate-500 mt-1">Monthly savings possible</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-blue-600">
                ${result.totalAnnualSavings.toFixed(0)}
              </p>
              <p className="text-sm text-slate-500 mt-1">Annual savings possible</p>
            </CardContent>
          </Card>
        </div>

        {/* Per tool breakdown */}
        <h3 className="text-xl font-bold text-slate-900 mb-4">Tool-by-tool breakdown</h3>
        <div className="space-y-4 mb-10">
          {result.recommendations.map((rec) => (
            <Card key={rec.toolId} className={
              rec.severity === "overspending"
                ? "border-red-200"
                : rec.severity === "consider"
                ? "border-yellow-200"
                : "border-green-200"
            }>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{rec.toolName}</h4>
                    <p className="text-sm text-slate-500">Current: {rec.currentPlanName}</p>
                  </div>
                  <SeverityBadge severity={rec.severity} />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-slate-500">Current spend</p>
                    <p className="font-semibold">${rec.currentMonthlySpend.toFixed(0)}/mo</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Recommended</p>
                    <p className="font-semibold text-blue-700">{rec.recommendedAction}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Potential saving</p>
                    <p className={`font-semibold ${rec.monthlySavings > 0 ? "text-green-600" : "text-slate-600"}`}>
                      {rec.monthlySavings > 0 ? `$${rec.monthlySavings.toFixed(0)}/mo` : "—"}
                    </p>
                  </div>
                </div>
                <Separator className="mb-3" />
                <p className="text-sm text-slate-600">{rec.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credex CTA for high savings */}
        {result.isHighSavings && (
          <Card className="mb-10 border-blue-300 bg-blue-50">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                Save even more with Credex
              </h3>
              <p className="text-blue-700 mb-4 max-w-xl mx-auto">
                You have over $500/month in identified savings. Credex helps startups
                access verified AI credits at a discount — the same tools, for less.
                Book a free consultation to see what's available for your stack.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book a Free Credex Consultation →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lead capture */}
        {!submitted ? (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>
                {result.isAlreadyOptimal
                  ? "Get notified when new optimizations apply to your stack"
                  : "Get your full report by email"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showLeadForm ? (
                <div className="text-center">
                  <Button
                    onClick={() => setShowLeadForm(true)}
                    className="bg-slate-900 hover:bg-slate-700"
                  >
                    {result.isAlreadyOptimal
                      ? "Notify me of new savings →"
                      : "Email me this report →"}
                  </Button>
                  <p className="text-xs text-slate-400 mt-2">
                    No spam. One email with your report.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="your@email.com *"
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company name (optional)"
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Your role (optional)"
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Button
                    onClick={handleLeadSubmit}
                    disabled={!email || submitting}
                    className="w-full bg-slate-900 hover:bg-slate-700"
                  >
                    {submitting ? "Sending..." : "Send my report →"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-10 border-green-200 bg-green-50 text-center">
            <CardContent className="pt-6">
              <p className="text-green-700 font-semibold text-lg">✓ Report sent!</p>
              <p className="text-green-600 text-sm mt-1">
                Check your inbox. We'll follow up if we find additional savings for your stack.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Start over */}
        <div className="text-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            ← Start a new audit
          </Button>
        </div>
      </main>
    </div>
  );
}