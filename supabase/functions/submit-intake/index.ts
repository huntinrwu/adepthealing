import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const MAX_SUBMISSIONS_PER_HOUR = 3;

const intakeSchema = z.object({
  first_name: z.string().trim().min(1).max(50),
  last_name: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not"]),
  address: z.string().trim().min(1).max(200),
  emergency_contact: z.string().trim().min(1).max(100),
  emergency_phone: z.string().trim().min(7).max(20),
  primary_concern: z.string().trim().min(1).max(1000),
  conditions: z.array(z.string().max(50)).max(20).optional().default([]),
  medical_history: z.string().max(2000).optional().nullable(),
  current_medications: z.string().max(1000).optional().nullable(),
  allergies: z.string().max(500).optional().nullable(),
  previous_acupuncture: z.enum(["yes", "no"]),
  referral_source: z.string().max(200).optional().nullable(),
  website: z.string().max(0, "Bot detected").optional(),
});

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

    const { website, ...insertData } = parsed.data;

    const { data, error } = await supabase.from("intake_submissions").insert({
      ...insertData,
      status: "new",
    }).select("id").single();

    if (error) {
      // Do not log PHI — only log a generic error indicator
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
