import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, role, monthlySavings, annualSavings } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Honeypot check (abuse protection)
    if (body.website) {
      return NextResponse.json({ ok: true }); // silently ignore bots
    }

    const { error } = await supabase.from("leads").insert({
      email,
      company: company || null,
      role: role || null,
      monthly_savings: monthlySavings || 0,
      annual_savings: annualSavings || 0,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}