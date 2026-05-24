"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuditResult, ToolRecommendation } from "@/lib/audit";

function SeverityBadge({ severity }: { severity: ToolRecommendation["severity"] }) {
  if (severity === "overspending")
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overspending</Badge>;
  if (severity === "consider")
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Consider switching</Badge>;
  return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Optimal</Badge>;
}

export default function SharedAuditClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/audits/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setNotFound(true);
        } else {
          setResult(data.auditResult);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading audit...</p>
      </div>
    );
  }

  if (notFound || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600 text-lg">Audit not found.</p>
        <Button onClick={() => router.push("/")}>Run your own audit →</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">SpendSmart AI</h1>
            <p className="text-xs text-slate-500">Free AI spend audit by Credex</p>
          </div>
          <Button size="sm" onClick={() => router.push("/")}>
            Run my own audit →
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700">Shared Audit</Badge>
          <h2 className="text-5xl font-bold text-green-600 mb-3">
            ${result.totalMonthlySavings.toFixed(0)}/mo
          </h2>
          <p className="text-xl text-slate-600 mb-1">in potential monthly savings</p>
          <p className="text-3xl font-semibold text-slate-800">
            ${result.totalAnnualSavings.toFixed(0)} saved per year
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">${result.totalMonthlySpend.toFixed(0)}</p>
              <p className="text-sm text-slate-500 mt-1">Current monthly spend</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-green-600">${result.totalMonthlySavings.toFixed(0)}</p>
              <p className="text-sm text-slate-500 mt-1">Monthly savings</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold text-blue-600">${result.totalAnnualSavings.toFixed(0)}</p>
              <p className="text-sm text-slate-500 mt-1">Annual savings</p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-4">Tool-by-tool breakdown</h3>
        <div className="space-y-4 mb-10">
          {result.recommendations.map((rec) => (
            <Card key={rec.toolId} className={
              rec.severity === "overspending" ? "border-red-200"
              : rec.severity === "consider" ? "border-yellow-200"
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
                    <p className="text-slate-500">Saving</p>
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

        <Card className="text-center border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-blue-900 font-semibold mb-2">Want to audit your own AI spend?</p>
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              Run my free audit →
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}