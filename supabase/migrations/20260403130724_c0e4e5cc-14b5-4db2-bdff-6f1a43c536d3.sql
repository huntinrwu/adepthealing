-- Lock down user_roles: only admins can INSERT, UPDATE, DELETE
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Remove public INSERT on contact_submissions (will use edge function instead)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;