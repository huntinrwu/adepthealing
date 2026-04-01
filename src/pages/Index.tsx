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
    "Expert acupuncture, traditional Chinese medicine, herbal therapy, cupping, and holistic wellness services. Pain relief, stress management, fertility support, and whole-person care.",
  url: "https://adepthealing.com",
  medicalSpecialty: "Acupuncture",
  availableService: [
    { "@type": "MedicalTherapy", name: "Acupuncture" },
    { "@type": "MedicalTherapy", name: "Chinese Herbal Medicine" },
    { "@type": "MedicalTherapy", name: "Cupping Therapy" },
    { "@type": "MedicalTherapy", name: "Moxibustion" },
  ],
  priceRange: "$$",
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Adept Healing | Acupuncture & Holistic Wellness | Traditional Chinese Medicine</title>
        <meta
          name="description"
          content="Adept Healing offers expert acupuncture, Chinese herbal medicine, cupping therapy, and holistic wellness services. Relieve pain, reduce stress, and restore balance with traditional Chinese medicine."
        />
        <meta
          name="keywords"
          content="acupuncture, traditional Chinese medicine, TCM, holistic healing, herbal medicine, cupping therapy, pain relief, stress relief, anxiety treatment, fertility acupuncture, sports acupuncture, wellness, natural healing, alternative medicine, moxibustion, meridian therapy, energy healing, chronic pain treatment, migraine relief, digestive health"
        />
        <meta property="og:title" content="Adept Healing | Acupuncture & Holistic Wellness" />
        <meta
          property="og:description"
          content="Expert acupuncture and traditional Chinese medicine. Restore balance, relieve pain, and nurture your body's natural healing power."
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
