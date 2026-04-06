import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useInView } from "@/hooks/useInView";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(1, "Please tell us how we can help").max(2000),
  website: z.string().max(0).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactFormSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { ref, inView } = useInView();
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-contact", {
        body: { name: data.name, email: data.email, phone: data.phone || null, interest: "general", message: data.message, website: data.website || "" },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting contact form:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 md:py-20 px-4 md:px-6 lg:px-12 bg-sage-light">
      <div className="max-w-2xl mx-auto" ref={ref}>
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Contact</p>
          <h2 className="heading-lg text-foreground mb-4">Get in Touch</h2>
          <p className="body-md text-muted-foreground mb-8">
            Have a question or want to schedule an appointment? Send a message and I'll get back to you.
          </p>

          {submitted ? (
            <div className="text-center py-12 animate-fade-in">
              <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="heading-md text-foreground mb-2">Message Sent!</h3>
              <p className="body-md text-muted-foreground">Thanks for reaching out. I'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register("name")} className="mt-1" />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" {...register("message")} placeholder="How can I help?" className="mt-1 min-h-[120px]" />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
              </div>
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
              </div>
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-primary-foreground px-10 py-3 rounded-full font-display font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
