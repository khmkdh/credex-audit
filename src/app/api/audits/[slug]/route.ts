import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabase
      .from("audits")
      .select("audit_result, form_data, created_at")
      .eq("slug", params.slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Strip personal info from public version
    const safeFormData = {
      teamSize: data.form_data.teamSize,
      useCase: data.form_data.useCase,
      tools: data.form_data.tools,
    };

    return NextResponse.json({
      auditResult: data.audit_result,
      formData: safeFormData,
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error("Audit fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}