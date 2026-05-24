import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, auditResult } = body;

    const slug = nanoid(10);

    const { error } = await supabase.from("audits").insert({
      slug,
      form_data: formData,
      audit_result: auditResult,
    });

    if (error) throw error;

    return NextResponse.json({ slug });
  } catch (err) {
    console.error("Audit save error:", err);
    return NextResponse.json({ error: "Failed to save audit" }, { status: 500 });
  }
}