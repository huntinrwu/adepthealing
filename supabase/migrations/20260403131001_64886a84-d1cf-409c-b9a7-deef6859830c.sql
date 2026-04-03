ALTER TABLE public.patient_visits
  ADD COLUMN visit_status text NOT NULL DEFAULT 'completed',
  ADD COLUMN symptoms text NULL,
  ADD COLUMN prescriptions text NULL,
  ADD COLUMN results text NULL;