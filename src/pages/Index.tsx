import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutMeSection from "@/components/AboutMeSection";
import AboutAcupunctureSection from "@/components/AboutAcupunctureSection";
import LocationSection from "@/components/LocationSection";
import ContactFormSection from "@/components/ContactFormSection";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Adept Healing",
  description:
    "Acupuncture in Herndon, Virginia — serving Fairfax County, Northern Virginia, and the DC metro area.",
  url: "https://adepthealing.com",
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
      dayOfWeek: ["Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  medicalSpecialty: "Acupuncture",
  priceRange: "$$",
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Adept Healing | Acupuncture in Herndon, VA</title>
        <meta
          name="description"
          content="Adept Healing offers acupuncture in Herndon, Virginia. Pain relief, stress management, and wellness. Most insurance carriers accepted. Serving Fairfax County and Northern Virginia."
        />
        <meta property="og:title" content="Adept Healing | Acupuncture in Herndon, VA" />
        <meta property="og:description" content="Acupuncture in Herndon, Virginia. Pain relief, stress management, and wellness. Most insurance carriers accepted." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adepthealing.com" />
        <link rel="canonical" href="https://adepthealing.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      <main>
        <HeroSection />
        <AboutAcupunctureSection />
        <LocationSection />
        <ContactFormSection />
        <AboutMeSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
