import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminGuardProps {
  children: React.ReactNode;
}

const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour inactivity timeout

const AdminGuard = ({ children }: AdminGuardProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const signOutAndRedirect = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    const checkAdmin = async () => {
      // Use getUser() which verifies the JWT server-side, not just getSession()
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        await signOutAndRedirect();
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    checkAdmin();

    // Session inactivity timeout
    let inactivityTimer: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        signOutAndRedirect();
      }, SESSION_TIMEOUT_MS);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      subscription.unsubscribe();
      clearTimeout(inactivityTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [navigate, signOutAndRedirect]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
};

export default AdminGuard;
