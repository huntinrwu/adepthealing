CREATE POLICY "Deny all client access to rate limits"
ON public.submission_rate_limits
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_audit_entry(text, text, uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_audit_entry(text, text, uuid, jsonb) TO authenticated, service_role;