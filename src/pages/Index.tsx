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
        <title>Adept Healing | Acupuncture in Herndon & Fairfax County VA | Pain Relief & Wellness</title>
        <meta
          name="description"
          content="Adept Healing offers expert acupuncture in Herndon, Virginia — serving Fairfax County, Northern Virginia, and the DC metro area. Relieve chronic pain, reduce stress, and restore balance with over a decade of experience."
        />
        <meta
          name="keywords"
          content="acupuncture Herndon VA, acupuncture Fairfax County, acupuncture Northern Virginia, acupuncture DC metro, acupuncture near me, pain relief acupuncture, back pain acupuncture, migraine acupuncture, sciatica treatment, neck pain acupuncture, stress relief acupuncture, anxiety acupuncture, sports acupuncture, knee pain acupuncture, shoulder pain acupuncture, acupuncture Reston VA, acupuncture Sterling VA, acupuncture Ashburn VA, acupuncture Fairfax VA, traditional Chinese medicine, licensed acupuncturist, natural pain relief"
        />
        <meta property="og:title" content="Adept Healing | Acupuncture in Herndon & Fairfax County VA" />
        <meta
          property="og:description"
          content="Expert acupuncture in Herndon, Virginia. Over a decade of experience helping patients relieve pain, reduce stress, and heal naturally. Serving Fairfax County and the DC metro area."
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
