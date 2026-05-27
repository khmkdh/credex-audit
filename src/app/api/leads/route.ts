import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, role, monthlySavings, annualSavings } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Honeypot check (abuse protection)
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    // Save to Supabase
    const { error } = await supabase.from("leads").insert({
      email,
      company: company || null,
      role: role || null,
      monthly_savings: monthlySavings || 0,
      annual_savings: annualSavings || 0,
    });

    if (error) throw error;

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "SpendSmart AI <onboarding@resend.dev>",
        to: "khyatimadhubora0606@gmail.com",
        subject: "Your AI Spend Audit Report",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #0f172a; font-size: 24px;">Your AI Spend Audit</h1>
            <p style="color: #475569;">Thanks for using SpendSmart AI — here's a summary of your audit.</p>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">POTENTIAL MONTHLY SAVINGS</p>
              <p style="margin: 8px 0 0; color: #16a34a; font-size: 32px; font-weight: bold;">
                $${monthlySavings?.toFixed(0) || 0}/mo
              </p>
              <p style="margin: 8px 0 0; color: #0f172a; font-size: 18px; font-weight: 600;">
                $${annualSavings?.toFixed(0) || 0} saved per year
              </p>
            </div>

            ${monthlySavings > 500 ? `
            <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0; color: #1d4ed8; font-weight: 600;">Save even more with Credex</p>
              <p style="margin: 8px 0 0; color: #3b82f6;">
                You have significant savings potential. Credex helps startups access 
                verified AI credits at a discount. 
                <a href="https://credex.rocks" style="color: #2563eb;">Learn more →</a>
              </p>
            </div>
            ` : ''}

            <p style="color: #64748b; font-size: 14px;">
              Built by <a href="https://credex.rocks" style="color: #2563eb;">Credex</a> — 
              the marketplace for AI infrastructure credits.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead capture error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}