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
    "Expert acupuncture in Herndon, Virginia — serving Fairfax County, Northern Virginia, and the DC metro area. Over a decade of experience in pain relief, stress management, and whole-person care.",
  url: "https://adepthealing.com",
  telephone: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1033 Sterling Road, Suite 105",
    addressLocality: "Herndon",
    addressRegion: "VA",
    postalCode: "20170",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.9697,
    longitude: -77.3861,
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
    { "@type": "MedicalTherapy", name: "Acupuncture for Back Pain" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Neck Pain" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Migraines" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Sciatica" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Stress & Anxiety" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Sports Injuries" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Digestive Health" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Knee Pain" },
    { "@type": "MedicalTherapy", name: "Acupuncture for Shoulder Pain" },
  ],
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Herndon", containedInPlace: { "@type": "State", name: "Virginia" } },
    { "@type": "City", name: "Reston" },
    { "@type": "City", name: "Sterling" },
    { "@type": "City", name: "Ashburn" },
    { "@type": "City", name: "Leesburg" },
    { "@type": "City", name: "Chantilly" },
    { "@type": "City", name: "Centreville" },
    { "@type": "City", name: "Fairfax" },
    { "@type": "City", name: "Vienna" },
    { "@type": "City", name: "Great Falls" },
    { "@type": "City", name: "Tysons" },
    { "@type": "AdministrativeArea", name: "Fairfax County" },
    { "@type": "AdministrativeArea", name: "Loudoun County" },
    { "@type": "AdministrativeArea", name: "Northern Virginia" },
    { "@type": "AdministrativeArea", name: "Washington DC Metro Area" },
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
