import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const IntakeForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() && !phone.trim()) e.contact = "Email or phone number is required";
    if (!description.trim()) e.description = "Please describe your reason for visiting";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-intake", {
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          description: description.trim(),
          website: "",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // Generic error — no PHI logged
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 section-padding bg-background">
          <div className="text-center max-w-lg animate-fade-in">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="heading-lg text-foreground mb-4">Thank You!</h1>
            <p className="body-lg text-muted-foreground mb-8">
              Your information has been received. We'll be in touch shortly to schedule your appointment.
            </p>
            <a href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const inputClass = "mt-1 w-full h-12 rounded-lg border border-input bg-background px-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <>
      <Helmet>
        <title>Patient Intake Form | Adept Healing Acupuncture | Herndon VA</title>
        <meta name="description" content="Complete the patient intake form for Adept Healing acupuncture to get started." />
        <link rel="canonical" href="https://adepthealing.com/intake" />
      </Helmet>
      <Navbar />
      <main className="pt-20 bg-background">
        <div className="section-padding">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-3">Welcome</p>
              <h1 className="heading-lg text-foreground mb-3">Patient Intake Form</h1>
              <p className="body-md text-muted-foreground">
                Fill out the basics and we'll reach out to schedule your visit.
              </p>
            </div>

            <form onSubmit={onSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} autoComplete="tel" />
                {errors.contact && <p className="text-destructive text-sm mt-1">{errors.contact}</p>}
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium text-foreground">Reason for Visit *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full min-h-[100px] rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Briefly describe what brings you in..."
                />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="pt-2 text-center">
                <button type="submit" disabled={submitting} className="bg-primary text-primary-foreground px-10 py-3 rounded-full text-lg font-display font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 w-full md:w-auto">
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default IntakeForm;
