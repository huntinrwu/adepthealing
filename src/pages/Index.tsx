import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Adept Healing",
  description:
    "Expert acupuncture and holistic wellness services in Herndon, Virginia. Pain relief, stress management, digestive health, sports recovery, and whole-person care.",
  url: "https://adepthealing.com",
  telephone: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1033 Sterling Road, Suite 105",
    addressLocality: "Herndon",
    addressRegion: "VA",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "17:00",
    },
  ],
  medicalSpecialty: "Acupuncture",
  availableService: [
    { "@type": "MedicalTherapy", name: "Acupuncture for Pain Relief" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Stress & Anxiety" },
    { "@type": "MedicalTherapy", name: "Digestive & General Wellness Acupuncture" },
    { "@type": "MedicalTherapy", name: "Sports Injury Acupuncture" },
  ],
  priceRange: "$$",
  areaServed: [
    "Herndon", "Reston", "Sterling", "Ashburn", "Leesburg",
    "Chantilly", "Centreville", "Fairfax", "Northern Virginia",
  ],
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Adept Healing | Acupuncture in Herndon VA | Pain Relief & Holistic Wellness</title>
        <meta
          name="description"
          content="Adept Healing offers expert acupuncture in Herndon, Virginia. Relieve chronic pain, reduce stress, support fertility, and restore balance with personalized acupuncture treatments. Serving Northern Virginia."
        />
        <meta
          name="keywords"
          content="acupuncture Herndon VA, acupuncture Northern Virginia, acupuncture near me, pain relief acupuncture, stress relief acupuncture, fertility acupuncture, sports acupuncture, back pain acupuncture, migraine acupuncture, anxiety acupuncture, holistic healing, traditional Chinese medicine, TCM, acupuncture Reston, acupuncture Sterling, acupuncture Ashburn, acupuncture Fairfax, natural pain relief, insomnia acupuncture, sciatica treatment"
        />
        <meta property="og:title" content="Adept Healing | Acupuncture in Herndon VA" />
        <meta
          property="og:description"
          content="Expert acupuncture in Herndon, Virginia. Restore balance, relieve pain, and nurture your body's natural healing power."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adepthealing.com" />
        <link rel="canonical" href="https://adepthealing.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
