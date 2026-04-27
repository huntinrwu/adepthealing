import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_SUBMISSIONS_PER_HOUR = 3;
const NOTIFY_EMAIL = "Twuhealing@gmail.com";
const FROM_NAME = "Adept Healing";
const GMAIL_GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(255).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().min(1).max(2000),
  website: z.string().max(0, "Bot detected").optional(),
}).refine(
  (data) => data.email.length > 0 || data.phone.length > 0,
  { message: "Email or phone is required" }
);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, "<br/>");

// Encode a string to base64url (Gmail API expects base64url for raw messages)
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRawEmail(opts: {
  to: string;
  from: string;
  subject: string;
  body: string;
  contentType?: "text/html" | "text/plain";
  replyTo?: string;
}): string {
  const contentType = opts.contentType ?? "text/html";
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: ${contentType}; charset="UTF-8"`,
    "Content-Transfer-Encoding: 7bit",
  ];
  if (opts.replyTo) headers.push(`Reply-To: ${opts.replyTo}`);
  const message = headers.join("\r\n") + "\r\n\r\n" + opts.body;
  return toBase64Url(message);
}

async function sendGmail(raw: string, lovableKey: string, gmailKey: string) {
  const res = await fetch(`${GMAIL_GATEWAY}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gmailKey,
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail send failed [${res.status}]: ${errText}`);
  }
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

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
      .eq("form_type", "inquiry")
      .gte("submitted_at", oneHourAgo);

    if ((count ?? 0) >= MAX_SUBMISSIONS_PER_HOUR) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase.from("submission_rate_limits").insert({
      ip_address: ip,
      form_type: "inquiry",
    });

    const { data: inserted, error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email || "not-provided@placeholder.com",
      phone: parsed.data.phone || null,
      interest: "general",
      message: parsed.data.message,
      status: "new",
    }).select("display_id").single();

    if (error) {
      console.error("Inquiry insert failed:", error.code);
      return new Response(
        JSON.stringify({ error: "Failed to submit form" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send emails via Gmail (best-effort, don't fail the request)
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_MAIL_API_KEY = Deno.env.get("GOOGLE_MAIL_API_KEY");

    if (LOVABLE_API_KEY && GOOGLE_MAIL_API_KEY) {
      const fromAddress = `${FROM_NAME} <${NOTIFY_EMAIL}>`;
      const displayId = inserted?.display_id;

      // 1. Notification email to Max (sent from his own Gmail to himself)
      try {
        const notifyHtml = `
          <h2>New Inquiry${displayId ? ` (INQ-${displayId})` : ""}</h2>
          <p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
          <p><strong>Email:</strong> ${parsed.data.email ? escapeHtml(parsed.data.email) : "<em>not provided</em>"}</p>
          <p><strong>Phone:</strong> ${parsed.data.phone ? escapeHtml(parsed.data.phone) : "<em>not provided</em>"}</p>
          <p><strong>Reason for visit:</strong></p>
          <p>${escapeHtml(parsed.data.message)}</p>
          <hr/>
          <p style="color:#888;font-size:12px;">Reply directly to this email to respond to ${escapeHtml(parsed.data.name)}.</p>
        `;
        const replyTo = parsed.data.email && parsed.data.email.length > 0 ? parsed.data.email : undefined;
        const rawNotify = buildRawEmail({
          to: NOTIFY_EMAIL,
          from: fromAddress,
          subject: `New inquiry from ${parsed.data.name}`,
          html: notifyHtml,
          replyTo,
        });
        await sendGmail(rawNotify, LOVABLE_API_KEY, GOOGLE_MAIL_API_KEY);
      } catch (err) {
        console.error("Notification email error:", err instanceof Error ? err.message : err);
      }

      // 2. Confirmation email to inquirer (only if they provided an email)
      if (parsed.data.email && parsed.data.email.length > 0) {
        try {
          const confirmationHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #333;">
              <h2 style="color: #2d5016;">Thank you for reaching out, ${escapeHtml(parsed.data.name)}!</h2>
              <p>I've received your message and will get back to you as soon as possible — typically within 1–2 business days.</p>
              <p><strong>Here's a copy of what you sent:</strong></p>
              <div style="background:#f6f6f1;border-left:3px solid #2d5016;padding:12px 16px;margin:16px 0;border-radius:4px;">
                ${escapeHtml(parsed.data.message)}
              </div>
              <p>If your matter is urgent, feel free to reply directly to this email.</p>
              <p style="margin-top:24px;">Warmly,<br/>Max<br/><em>Adept Healing</em></p>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;"/>
              <p style="color:#888;font-size:12px;">This is an automated confirmation. Please don't share sensitive medical details by email.</p>
            </div>
          `;
          const rawConfirm = buildRawEmail({
            to: parsed.data.email,
            from: fromAddress,
            subject: "We received your message — Adept Healing",
            html: confirmationHtml,
          });
          await sendGmail(rawConfirm, LOVABLE_API_KEY, GOOGLE_MAIL_API_KEY);
        } catch (err) {
          console.error("Confirmation email error:", err instanceof Error ? err.message : err);
        }
      }
    } else {
      console.error("Gmail keys missing — emails not sent");
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
