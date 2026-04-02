import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { email, password } = await req.json();

  // Check if user exists
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  const existing = users?.users?.find((u) => u.email === email);

  if (existing) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ message: "Password updated", user_id: existing.id }));
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

    // Add admin role
    await supabaseAdmin.from("user_roles").insert({ user_id: data.user.id, role: "admin" });

    return new Response(JSON.stringify({ message: "User created with admin role", user_id: data.user.id }));
  }
});
