import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const attempts = useRef(0);
  const lockedUntil = useRef(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check lockout
    if (Date.now() < lockedUntil.current) {
      const minutesLeft = Math.ceil((lockedUntil.current - Date.now()) / 60000);
      setError(`Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.`);
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        attempts.current++;
        if (attempts.current >= MAX_ATTEMPTS) {
          lockedUntil.current = Date.now() + LOCKOUT_DURATION_MS;
          attempts.current = 0;
          setError("Too many failed attempts. Account temporarily locked for 15 minutes.");
        } else {
          setError("Invalid email or password.");
        }
        return;
      }
      if (data.user) {
        const { data: roleData, error: roleError } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
        if (roleError || !roleData) { await supabase.auth.signOut(); setError("You do not have admin access."); return; }
        attempts.current = 0;
        navigate("/admin");
      }
    } catch { setError("An unexpected error occurred."); } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Admin Login | Adept Healing</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Navbar />
      <main className="pt-20 bg-background min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-6 animate-fade-in">
          <div className="bg-card rounded-2xl p-8 shadow-sm">
            <h1 className="heading-md text-foreground text-center mb-6">Admin Login</h1>
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1" /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="mt-1" /></div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminLogin;
