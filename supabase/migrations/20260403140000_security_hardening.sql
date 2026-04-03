-- Security hardening migration
-- 1. Ensure user_roles SELECT is admin-only (prevent non-admins from enumerating roles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view roles' AND tablename = 'user_roles'
  ) THEN
    CREATE POLICY "Admins can view roles" ON public.user_roles
      FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 2. Ensure authenticated users can check their OWN role (needed for AdminGuard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own role' AND tablename = 'user_roles'
  ) THEN
    CREATE POLICY "Users can view own role" ON public.user_roles
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Add CHECK constraints for status fields to prevent injection of arbitrary status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'contact_status_check'
  ) THEN
    ALTER TABLE public.contact_submissions
      ADD CONSTRAINT contact_status_check CHECK (status IN ('new', 'pending', 'contacted', 'scheduled'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'intake_status_check'
  ) THEN
    ALTER TABLE public.intake_submissions
      ADD CONSTRAINT intake_status_check CHECK (status IN ('new', 'pending', 'contacted', 'scheduled'));
  END IF;
END $$;

-- 4. Add index on user_roles for faster admin checks
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles (user_id, role);

-- 5. Restrict audit_log to prevent updates/deletes (append-only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'No one can update audit log' AND tablename = 'audit_log'
  ) THEN
    CREATE POLICY "No one can update audit log" ON public.audit_log
      FOR UPDATE USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'No one can delete audit log' AND tablename = 'audit_log'
  ) THEN
    CREATE POLICY "No one can delete audit log" ON public.audit_log
      FOR DELETE USING (false);
  END IF;
END $$;
