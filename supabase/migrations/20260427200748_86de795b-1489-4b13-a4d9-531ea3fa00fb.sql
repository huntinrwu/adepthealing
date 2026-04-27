-- 1. Block all client-side INSERTs on contact_submissions; submissions must go through the submit-inquiry edge function (service role bypasses RLS)
CREATE POLICY "Block client inserts on contact_submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- 2. Revoke EXECUTE on SECURITY DEFINER helper functions from anon/authenticated/public.
-- These are internal helpers used in RLS policies and triggers, not meant for direct API calls.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_audit_entry(text, text, uuid, jsonb) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;