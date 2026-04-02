
-- Add auto-increment display IDs
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS display_id SERIAL;
ALTER TABLE public.intake_submissions ADD COLUMN IF NOT EXISTS display_id SERIAL;

-- Add linked_inquiry_id to intake_submissions to link patients to inquiries
ALTER TABLE public.intake_submissions ADD COLUMN IF NOT EXISTS linked_inquiry_id UUID REFERENCES public.contact_submissions(id) ON DELETE SET NULL;
