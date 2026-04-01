import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const intakeSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Valid phone number required").max(20),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select gender"),
  address: z.string().trim().min(1, "Address is required").max(200),
  emergencyContact: z.string().trim().min(1, "Emergency contact is required").max(100),
  emergencyPhone: z.string().trim().min(7, "Emergency phone required").max(20),
  primaryConcern: z.string().trim().min(1, "Please describe your primary concern").max(1000),
  medicalHistory: z.string().max(2000).optional(),
  currentMedications: z.string().max(1000).optional(),
  allergies: z.string().max(500).optional(),
  previousAcupuncture: z.string().min(1, "Please select"),
  referralSource: z.string().max(200).optional(),
  consent: z.boolean().refine((v) => v === true, "You must agree to proceed"),
});

type IntakeFormData = z.infer<typeof intakeSchema>;

const conditions = [
  "Chronic Pain", "Headaches / Migraines", "Back Pain", "Neck & Shoulder Pain",
  "Anxiety / Stress", "Depression", "Insomnia", "Digestive Issues",
  "Allergies / Sinusitis", "Fertility", "Women's Health", "Sports Injuries",
  "Arthritis", "Fatigue / Low Energy", "High Blood Pressure", "Other",
];

const IntakeForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema),
    defaultValues: { consent: false },
  });

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const onSubmit = async (data: IntakeFormData) => {
    try {
      const { error } = await supabase.from("intake_submissions").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        emergency_contact: data.emergencyContact,
        emergency_phone: data.emergencyPhone,
        primary_concern: data.primaryConcern,
        conditions: selectedConditions,
        medical_history: data.medicalHistory || null,
        current_medications: data.currentMedications || null,
        allergies: data.allergies || null,
        previous_acupuncture: data.previousAcupuncture,
        referral_source: data.referralSource || null,
      });
      if (error) throw error;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error submitting intake form:", err);
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
            <h1 className="heading-lg text-foreground mb-4">Thank You!</h1>
            <p className="body-lg text-muted-foreground mb-8">
              Your intake form has been received. Our team will review your information 
              and contact you shortly to schedule your first appointment.
            </p>
            <a href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
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
        <title>Patient Intake Form | Adept Healing Acupuncture | Herndon VA</title>
        <meta
          name="description"
          content="Complete the patient intake form for Adept Healing acupuncture. Share your health history so we can create a personalized acupuncture treatment plan."
        />
        <link rel="canonical" href="https://adepthealing.com/intake" />
      </Helmet>

      <Navbar />
      <main className="pt-20 bg-background">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
                Welcome
              </p>
              <h1 className="heading-lg text-foreground mb-4">Patient Intake Form</h1>
              <p className="body-md text-muted-foreground max-w-xl mx-auto">
                Please fill out this form before your first visit. This helps us understand your health 
                history and create a personalized acupuncture treatment plan.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Personal Info */}
              <section className="bg-card rounded-2xl p-8 shadow-sm">
                <h2 className="heading-md text-foreground mb-6">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...register("firstName")} className="mt-1" />
                    {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" {...register("lastName")} className="mt-1" />
                    {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email")} className="mt-1" />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="mt-1" />
                    {errors.dateOfBirth && <p className="text-destructive text-sm mt-1">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      {...register("gender")}
                      className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                    {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" {...register("address")} className="mt-1" />
                    {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </section>

              {/* Emergency Contact */}
              <section className="bg-card rounded-2xl p-8 shadow-sm">
                <h2 className="heading-md text-foreground mb-6">Emergency Contact</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="emergencyContact">Name & Relationship *</Label>
                    <Input id="emergencyContact" {...register("emergencyContact")} placeholder="Jane Doe (Spouse)" className="mt-1" />
                    {errors.emergencyContact && <p className="text-destructive text-sm mt-1">{errors.emergencyContact.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Phone *</Label>
                    <Input id="emergencyPhone" type="tel" {...register("emergencyPhone")} className="mt-1" />
                    {errors.emergencyPhone && <p className="text-destructive text-sm mt-1">{errors.emergencyPhone.message}</p>}
                  </div>
                </div>
              </section>

              {/* Health Info */}
              <section className="bg-card rounded-2xl p-8 shadow-sm">
                <h2 className="heading-md text-foreground mb-6">Health Information</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="primaryConcern">Primary Health Concern *</Label>
                    <Textarea
                      id="primaryConcern"
                      {...register("primaryConcern")}
                      placeholder="Describe what brings you to seek acupuncture treatment..."
                      className="mt-1 min-h-[100px]"
                    />
                    {errors.primaryConcern && <p className="text-destructive text-sm mt-1">{errors.primaryConcern.message}</p>}
                  </div>

                  <div>
                    <Label className="mb-3 block">Conditions you're experiencing (select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {conditions.map((c) => (
                        <label
                          key={c}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedConditions.includes(c)
                              ? "border-primary bg-sage-light"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox
                            checked={selectedConditions.includes(c)}
                            onCheckedChange={() => toggleCondition(c)}
                          />
                          <span className="text-sm text-foreground">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      {...register("medicalHistory")}
                      placeholder="Past surgeries, hospitalizations, significant medical events..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentMedications">Current Medications & Supplements</Label>
                    <Textarea
                      id="currentMedications"
                      {...register("currentMedications")}
                      placeholder="List any medications, vitamins, or supplements you take..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input id="allergies" {...register("allergies")} placeholder="Drug, food, or environmental allergies..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="previousAcupuncture">Have you received acupuncture before? *</Label>
                    <select
                      id="previousAcupuncture"
                      {...register("previousAcupuncture")}
                      className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.previousAcupuncture && <p className="text-destructive text-sm mt-1">{errors.previousAcupuncture.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="referralSource">How did you hear about us?</Label>
                    <Input id="referralSource" {...register("referralSource")} placeholder="Google, friend, doctor referral..." className="mt-1" />
                  </div>
                </div>
              </section>

              {/* Consent */}
              <section className="bg-card rounded-2xl p-8 shadow-sm">
                <h2 className="heading-md text-foreground mb-4">Consent</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  I understand that the information I provide will be used to create a personalized 
                  treatment plan. I consent to acupuncture and related holistic therapies as recommended 
                  by my practitioner. I understand that acupuncture is a safe, effective form of healthcare 
                  and that results may vary.
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    onCheckedChange={(checked) => setValue("consent", checked === true, { shouldValidate: true })}
                  />
                  <span className="text-sm text-foreground">
                    I agree to the above and consent to treatment *
                  </span>
                </label>
                {errors.consent && <p className="text-destructive text-sm mt-1">{errors.consent.message}</p>}
              </section>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg font-display font-medium hover:opacity-90 transition-opacity shadow-lg"
                >
                  Submit Intake Form
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
