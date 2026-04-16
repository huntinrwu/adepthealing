import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const MAX_SUBMISSIONS_PER_HOUR = 3;

const intakeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(255).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  description: z.string().trim().min(1).max(2000),
  website: z.string().max(0, "Bot detected").optional(),
}).refine(
  (data) => data.email.length > 0 || data.phone.length > 0,
  { message: "Email or phone is required" }
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = intakeSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (parsed.data.website) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") || "unknown";

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("submission_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("form_type", "intake")
      .gte("submitted_at", oneHourAgo);

    if ((count ?? 0) >= MAX_SUBMISSIONS_PER_HOUR) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase.from("submission_rate_limits").insert({
      ip_address: ip,
      form_type: "intake",
    });

    const nameParts = parsed.data.name.split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const { error } = await supabase.from("intake_submissions").insert({
      first_name: firstName,
      last_name: lastName,
      email: parsed.data.email || "not-provided@placeholder.com",
      phone: parsed.data.phone || "N/A",
      date_of_birth: "1900-01-01",
      gender: "prefer-not",
      address: "N/A",
      emergency_contact: "N/A",
      emergency_phone: "N/A",
      primary_concern: parsed.data.description,
      conditions: [],
      previous_acupuncture: "no",
      status: "new",
    });

    if (error) {
      console.error("Intake submission failed:", error.code);
      return new Response(
        JSON.stringify({ error: "Failed to submit form" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
