import { Metadata } from "next";
import SharedAuditClient from "./SharedAuditClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/audits/${slug}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const savings = data.auditResult?.totalAnnualSavings ?? 0;

    return {
      title: `AI Spend Audit — $${savings.toFixed(0)} annual savings found`,
      description: `This team could save $${savings.toFixed(0)}/year on AI tools. Run your free audit on SpendSmart AI.`,
      openGraph: {
        title: `AI Spend Audit — $${savings.toFixed(0)}/year in savings`,
        description: `Free AI spend audit by Credex. See where you're overspending.`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `AI Spend Audit — $${savings.toFixed(0)}/year in savings`,
        description: `Free AI spend audit by Credex.`,
      },
    };
  } catch {
    return { title: "AI Spend Audit — SpendSmart AI" };
  }
}

export default async function SharedAuditPage({ params }: Props) {
  const { slug } = await params;
  return <SharedAuditClient slug={slug} />;
}