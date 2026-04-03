import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, MapPin } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const conditions = [
  "Back Pain & Sciatica", "Neck & Shoulder Pain", "Migraines & Headaches", "Knee & Joint Pain",
  "Sports Injuries", "Stress & Anxiety", "Insomnia & Sleep Issues", "Digestive Disorders",
  "TMJ & Jaw Pain", "Carpal Tunnel Syndrome", "Post-Surgical Recovery", "General Wellness",
];

const areas = [
  "Herndon", "Reston", "Vienna", "Oakton", "Great Falls",
  "McLean", "Tysons", "Chantilly", "Centreville", "Fairfax City",
  "Burke", "Springfield", "Annandale", "Falls Church",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Adept Healing — Acupuncture for Fairfax County",
  description: "Expert acupuncture serving Fairfax County, Virginia. Over a decade of experience treating chronic pain, migraines, stress, and more.",
  url: "https://adepthealing.com/acupuncture-fairfax-county-va",
  address: { "@type": "PostalAddress", streetAddress: "1033 Sterling Road, Suite 105", addressLocality: "Herndon", addressRegion: "VA", postalCode: "20170", addressCountry: "US" },
  geo: { "@type": "GeoCoordinates", latitude: 38.9697, longitude: -77.3861 },
  areaServed: { "@type": "AdministrativeArea", name: "Fairfax County, Virginia" },
  medicalSpecialty: "Acupuncture",
};

const FairfaxCountyAcupuncture = () => {
  const { ref: whyRef, inView: whyInView } = useInView();
  const { ref: condRef, inView: condInView } = useInView();

  return (
    <>
      <Helmet>
        <title>Acupuncture in Fairfax County VA | Pain Relief & Wellness | Adept Healing</title>
        <meta name="description" content="Looking for acupuncture in Fairfax County, Virginia? Adept Healing in Herndon offers expert acupuncture for pain relief, stress, migraines, and more. Over a decade of experience." />
        <meta name="keywords" content="acupuncture Fairfax County VA, acupuncture near me Fairfax, best acupuncturist Fairfax County, acupuncture Reston VA, acupuncture Vienna VA, back pain acupuncture Fairfax" />
        <meta property="og:title" content="Acupuncture in Fairfax County VA | Adept Healing" />
        <meta property="og:description" content="Expert acupuncture in Fairfax County, Virginia. Pain relief, stress management, and holistic wellness." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adepthealing.com/acupuncture-fairfax-county-va" />
        <link rel="canonical" href="https://adepthealing.com/acupuncture-fairfax-county-va" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-sage-light">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Serving Fairfax County &amp; Northern Virginia</p>
            <h1 className="heading-xl text-foreground mb-6">Acupuncture in Fairfax County, Virginia</h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Adept Healing provides expert acupuncture from our Herndon clinic, conveniently located for patients throughout Fairfax County. With over a decade of clinical experience, we deliver personalized treatments that address the root cause — not just the symptoms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-display font-medium hover:opacity-90 transition-opacity">
                Schedule an Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-display font-medium hover:bg-primary/5 transition-colors">
                Ask a Question
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background" ref={whyRef}>
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${whyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="heading-lg text-foreground mb-4">Why Fairfax County Patients Choose Adept Healing</h2>
              <p className="body-md text-muted-foreground max-w-2xl mx-auto">Patients across Fairfax County trust us for effective, compassionate acupuncture care.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Over a Decade of Experience", description: "With 10+ years of clinical practice, we've treated thousands of patients across a wide range of conditions." },
                { title: "Personalized Treatment Plans", description: "No two patients are alike. Every session is tailored to your specific condition, health history, and wellness goals." },
                { title: "Convenient Herndon Location", description: "Located at 1033 Sterling Road in Herndon — an easy drive from Reston, Vienna, Tysons, Great Falls, and throughout Fairfax County." },
              ].map((item, index) => (
                <div key={item.title} className={`bg-card rounded-2xl p-8 shadow-sm transition-all duration-500 ${whyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <h3 className="heading-md text-foreground mb-3">{item.title}</h3>
                  <p className="body-md text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-sage-light" ref={condRef}>
          <div className="max-w-5xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${condInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="heading-lg text-foreground mb-4">Conditions We Treat with Acupuncture</h2>
              <p className="body-md text-muted-foreground max-w-2xl mx-auto">Whether you're dealing with chronic pain, stress, or a sports injury — acupuncture can help.</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {conditions.map((condition, index) => (
                <div key={condition} className={`flex items-center gap-3 bg-background rounded-xl p-4 shadow-sm transition-all duration-400 ${condInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${index * 50}ms` }}>
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-body text-foreground">{condition}</span>
                </div>
              ))}
            </div>
            <div className={`text-center mt-12 transition-all duration-700 delay-300 ${condInView ? "opacity-100" : "opacity-0"}`}>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-medium hover:opacity-90 transition-opacity">
                Get Started — Book Your First Visit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="max-w-5xl mx-auto text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="heading-lg text-foreground mb-4">Serving All of Fairfax County</h2>
            <p className="body-md text-muted-foreground max-w-2xl mx-auto mb-8">Our Herndon clinic is centrally located for easy access from communities throughout Fairfax County and beyond.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {areas.map((area) => (
                <span key={area} className="bg-sage-light text-foreground px-5 py-2.5 rounded-full text-sm font-body">{area}</span>
              ))}
            </div>
            <Link to="/areas-we-serve" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              See all areas we serve <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="section-padding bg-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-foreground mb-4">Ready to Feel Better?</h2>
            <p className="body-lg text-muted-foreground mb-8">Schedule your first acupuncture appointment today. Patients across Fairfax County trust Adept Healing for effective, natural pain relief and whole-person wellness.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-display font-medium hover:opacity-90 transition-opacity">
                Schedule Your Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/faq" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-display font-medium hover:bg-primary/5 transition-colors">
                Read Our FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FairfaxCountyAcupuncture;
