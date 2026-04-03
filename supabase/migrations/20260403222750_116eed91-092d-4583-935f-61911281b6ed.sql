
-- Fix privilege escalation: drop existing INSERT policy and recreate restricted to service_role only
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Create a restrictive policy that effectively blocks all client-side inserts
-- Only service_role (used by edge functions) can insert roles
CREATE POLICY "No client insert on user_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Add rate limiting table for form submissions
CREATE TABLE public.submission_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  form_type text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS but no policies needed - only service_role accesses this
ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create index for fast lookups
CREATE INDEX idx_rate_limits_ip_time ON public.submission_rate_limits (ip_address, form_type, submitted_at);

-- Auto-cleanup old rate limit records (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.submission_rate_limits WHERE submitted_at < now() - interval '1 hour';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cleanup_rate_limits
AFTER INSERT ON public.submission_rate_limits
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_rate_limits();
