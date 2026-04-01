import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import acupunctureImg from "@/assets/acupuncture-treatment.jpg";
import meditationImg from "@/assets/wellness-meditation.jpg";
import digestiveImg from "@/assets/digestive-acupuncture-new.jpg";
import sportsImg from "@/assets/sports-acupuncture.jpg";

const services = [
  { title: "Acupuncture for Pain Relief", description: "Targeted acupuncture therapy for back pain, neck pain, migraines, sciatica, joint pain, shoulder pain, knee pain, and more. If it hurts, we can help.", image: acupunctureImg, alt: "Professional acupuncture treatment with fine needles for chronic pain relief and healing in Herndon VA" },
  { title: "Stress & Anxiety Acupuncture", description: "Calm the nervous system, reduce anxiety, improve sleep, and restore emotional balance with specialized acupuncture protocols.", image: meditationImg, alt: "Acupuncture for stress relief anxiety management and improved sleep quality" },
  { title: "Digestive & General Wellness", description: "Support digestive health, immune function, allergy relief, and overall vitality. Restore your body's natural balance.", image: digestiveImg, alt: "Acupuncture for digestive health general wellness and immune support in Northern Virginia" },
  { title: "Sports Injury & Recovery", description: "Accelerate healing from sports injuries, muscle strains, tendonitis, and post-surgical recovery. Reduce inflammation and restore mobility.", image: sportsImg, alt: "Sports acupuncture for injury recovery muscle strain and athletic performance" },
];

const ServicesSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">What We Offer</p>
          <h2 className="heading-lg text-foreground mb-4">Acupuncture Services</h2>
          <p className="body-md text-muted-foreground max-w-2xl mx-auto">Addressing the root cause of imbalance — not just the symptoms.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={`group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={service.image} alt={service.alt} loading="lazy" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 md:p-8">
                <h3 className="heading-md text-foreground mb-2 md:mb-3">{service.title}</h3>
                <p className="body-md text-muted-foreground text-sm md:text-base">{service.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={`mt-12 md:mt-16 bg-primary/10 rounded-2xl p-6 md:p-10 text-center transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="heading-md text-foreground mb-3">Not sure which treatment is right for you?</h3>
          <p className="body-md text-muted-foreground mb-6 max-w-xl mx-auto">Reach out and we'll help you find the best path to feeling better.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-medium hover:opacity-90 transition-opacity">
            Book a Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
