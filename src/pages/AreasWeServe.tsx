import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fairfaxCounty = [
  { name: "Herndon", note: "Our home clinic — 1033 Sterling Rd, Suite 105" },
  { name: "Reston", note: "Just minutes away via Reston Parkway" },
  { name: "Vienna", note: "A quick drive down Route 7" },
  { name: "Oakton", note: "Easy access via Hunter Mill Road" },
  { name: "Great Falls", note: "15 minutes via Georgetown Pike" },
  { name: "McLean", note: "Accessible via the Dulles Toll Road" },
  { name: "Tysons", note: "Short drive via Route 7 or 267" },
  { name: "Fairfax City", note: "Reachable via Route 50 or I-66" },
  { name: "Chantilly", note: "Nearby via Route 28" },
  { name: "Centreville", note: "Easy drive via Route 28 South" },
  { name: "Burke", note: "Accessible via Fairfax County Parkway" },
  { name: "Springfield", note: "Via I-495 or Fairfax County Parkway" },
  { name: "Annandale", note: "Via I-495 or Little River Turnpike" },
  { name: "Falls Church", note: "Quick access via Route 7" },
];

const loudounCounty = [
  { name: "Sterling", note: "Right next door — minutes from our clinic" },
  { name: "Ashburn", note: "Easy access via Route 28 or the Greenway" },
  { name: "Leesburg", note: "A scenic drive via Route 7 West" },
  { name: "South Riding", note: "Via Route 50 or Loudoun County Parkway" },
];

const dcMetro = [
  { name: "Washington, DC", note: "Via I-66 or the Dulles Toll Road" },
  { name: "Arlington", note: "Via I-66 East" },
  { name: "Alexandria", note: "Via I-495 or I-395" },
  { name: "Bethesda, MD", note: "Via I-495 North" },
  { name: "Silver Spring, MD", note: "Via I-495" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Adept Healing",
  description: "Expert acupuncture in Herndon, Virginia serving Fairfax County, Loudoun County, and the greater Washington DC metro area.",
  url: "https://adepthealing.com/areas-we-serve",
  address: { "@type": "PostalAddress", streetAddress: "1033 Sterling Road, Suite 105", addressLocality: "Herndon", addressRegion: "VA", postalCode: "20170", addressCountry: "US" },
  areaServed: [
    ...fairfaxCounty.map((a) => ({ "@type": "City", name: a.name + ", VA" })),
    ...loudounCounty.map((a) => ({ "@type": "City", name: a.name + ", VA" })),
    ...dcMetro.map((a) => ({ "@type": "City", name: a.name })),
    { "@type": "AdministrativeArea", name: "Fairfax County, Virginia" },
    { "@type": "AdministrativeArea", name: "Loudoun County, Virginia" },
    { "@type": "AdministrativeArea", name: "Washington DC Metropolitan Area" },
  ],
};

interface AreaGroupProps {
  title: string;
  areas: { name: string; note: string }[];
}

const AreaGroup = ({ title, areas }: AreaGroupProps) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <h2 className="heading-md text-foreground mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" /> {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {areas.map((area) => (
          <div key={area.name} className="bg-background rounded-xl p-5 shadow-sm border border-border/50">
            <h3 className="font-display text-lg font-semibold text-foreground">{area.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{area.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AreasWeServe = () => {
  return (
    <>
      <Helmet>
        <title>Areas We Serve | Acupuncture Near You | Adept Healing Herndon VA</title>
        <meta name="description" content="Adept Healing provides expert acupuncture to patients across Fairfax County, Loudoun County, and the DC metro area. Located in Herndon, VA." />
        <meta name="keywords" content="acupuncture near me, acupuncture Fairfax County, acupuncture Loudoun County, acupuncture Northern Virginia, acupuncture Herndon, acupuncture Reston, acupuncture Vienna VA" />
        <meta property="og:title" content="Areas We Serve | Adept Healing Acupuncture" />
        <meta property="og:description" content="Expert acupuncture serving Fairfax County, Loudoun County, and the greater DC metro area." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adepthealing.com/areas-we-serve" />
        <link rel="canonical" href="https://adepthealing.com/areas-we-serve" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-sage-light">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Conveniently Located</p>
            <h1 className="heading-xl text-foreground mb-6">Areas We Serve</h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">Our acupuncture clinic in Herndon, Virginia is centrally located to serve patients across Fairfax County, Loudoun County, and the greater Washington, DC metro area.</p>
          </div>
        </section>

        <section className="section-padding bg-sage-light">
          <div className="max-w-5xl mx-auto space-y-16">
            <AreaGroup title="Fairfax County" areas={fairfaxCounty} />
            <AreaGroup title="Loudoun County" areas={loudounCounty} />
            <AreaGroup title="Greater DC Metro" areas={dcMetro} />
          </div>
        </section>

        <section className="section-padding bg-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-foreground mb-4">Live Nearby? Let's Get You Feeling Better.</h2>
            <p className="body-lg text-muted-foreground mb-8">No matter where you are in the DC metro area, relief is just a short drive away.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-display font-medium hover:opacity-90 transition-opacity">
                Schedule an Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/acupuncture-fairfax-county-va" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-display font-medium hover:bg-primary/5 transition-colors">
                Fairfax County Acupuncture
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AreasWeServe;
