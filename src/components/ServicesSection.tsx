import { motion } from "framer-motion";
import acupunctureImg from "@/assets/acupuncture-treatment.jpg";
import meditationImg from "@/assets/wellness-meditation.jpg";
import digestiveImg from "@/assets/digestive-acupuncture.jpg";
import sportsImg from "@/assets/sports-acupuncture.jpg";

const services = [
  {
    title: "Acupuncture for Pain Relief",
    description:
      "Targeted meridian therapy for chronic pain, back pain, neck pain, migraines, sciatica, and joint discomfort. Restore energy flow and lasting relief.",
    image: acupunctureImg,
    alt: "Professional acupuncture treatment with fine needles for chronic pain relief and healing in Herndon VA",
  },
  {
    title: "Stress & Anxiety Acupuncture",
    description:
      "Specialized acupuncture protocols designed to calm the nervous system, reduce anxiety, improve sleep quality, and restore emotional balance. Experience profound relaxation and mental clarity.",
    image: meditationImg,
    alt: "Acupuncture for stress relief anxiety management and improved sleep quality",
  },
  {
    title: "Digestive & General Wellness",
    description:
      "Holistic acupuncture treatments supporting digestive health, immune function, allergy relief, and overall vitality. Restore your body's natural balance and promote long-term well-being.",
    image: digestiveImg,
    alt: "Acupuncture for digestive health general wellness and immune support in Northern Virginia",
  },
  {
    title: "Sports Injury & Recovery",
    description:
      "Accelerate healing from sports injuries, muscle strains, tendonitis, and post-surgical recovery. Acupuncture reduces inflammation, improves circulation, and restores mobility faster.",
    image: sportsImg,
    alt: "Sports acupuncture for injury recovery muscle strain and athletic performance",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
            What We Offer
          </p>
          <h2 className="heading-lg text-foreground mb-4">
            Acupuncture Services
          </h2>
          <p className="body-md text-muted-foreground max-w-2xl mx-auto">
            From chronic pain and stress relief to digestive wellness and sports recovery, 
            our acupuncture treatments address the root cause of imbalance — not just the symptoms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="heading-md text-foreground mb-3">{service.title}</h3>
                <p className="body-md text-muted-foreground">{service.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
