import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

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
        JSON.stringify({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.from("intake_submissions").insert({
      ...parsed.data,
      status: "new",
    }).select("id").single();

    if (error) {
      console.error("DB insert error:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to submit form" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
