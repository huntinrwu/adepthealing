
-- Fix 1: Constrain public INSERT on contact_submissions to status='new'
ALTER POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  WITH CHECK (status = 'new');

-- Fix 2: Constrain public INSERT on intake_submissions to status='new'
ALTER POLICY "Anyone can submit intake form"
  ON public.intake_submissions
  WITH CHECK (status = 'new');

-- Fix 3: Create SECURITY DEFINER function for audit log inserts
CREATE OR REPLACE FUNCTION public.create_audit_entry(
  _action text,
  _target_table text,
  _target_id uuid DEFAULT NULL,
  _details jsonb DEFAULT '{}'::jsonb
) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO audit_log(user_id, action, target_table, target_id, details)
  VALUES (auth.uid(), _action, _target_table, _target_id, _details);
$$;

-- Fix 4: Remove direct admin INSERT policy on audit_log
DROP POLICY IF EXISTS "Admins can insert audit log" ON public.audit_log;
