import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(20).optional(),
  interest: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(1, "Please tell us how we can help").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        interest: data.interest,
        message: data.message,
      });
      if (error) throw error;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 section-padding bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg"
          >
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="heading-lg text-foreground mb-4">Message Sent!</h1>
            <p className="body-lg text-muted-foreground mb-8">
              Thank you for reaching out. We'll get back to you shortly to discuss 
              how acupuncture can help you on your healing journey.
            </p>
            <a
              href="/"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </a>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Adept Healing Acupuncture | Herndon VA</title>
        <meta
          name="description"
          content="Contact Adept Healing to learn about our acupuncture services or schedule an appointment. Located in Herndon, Virginia, serving Northern Virginia."
        />
        <link rel="canonical" href="https://adepthealing.com/contact" />
      </Helmet>

      <Navbar />
      <main className="pt-20 bg-background">
        <div className="section-padding">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
                Get in Touch
              </p>
              <h1 className="heading-lg text-foreground mb-4">Contact Us</h1>
              <p className="body-md text-muted-foreground max-w-xl mx-auto">
                Interested in acupuncture? Have questions about our services? 
                Send us a message and we'll be happy to help.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-card rounded-2xl p-8 shadow-sm space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="interest">I'm interested in *</Label>
                  <select
                    id="interest"
                    {...register("interest")}
                    className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select a service...</option>
                    <option value="pain-relief">Acupuncture for Pain Relief</option>
                    <option value="stress-anxiety">Stress & Anxiety Relief</option>
                    <option value="fertility">Fertility Support</option>
                    <option value="sports">Sports Injury Recovery</option>
                    <option value="general">General Wellness</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                  {errors.interest && <p className="text-destructive text-sm mt-1">{errors.interest.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="message">How can we help? *</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Tell us what you're looking for, any questions you have, or your preferred appointment times..."
                  className="mt-1 min-h-[120px]"
                />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-10 py-3 rounded-full text-lg font-display font-medium hover:opacity-90 transition-opacity shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-muted-foreground">
                Already a patient?{" "}
                <Link to="/intake" className="text-primary hover:underline font-medium">
                  Fill out the Patient Intake Form
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
