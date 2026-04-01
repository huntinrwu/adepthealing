import { motion } from "framer-motion";
import acupunctureImg from "@/assets/acupuncture-treatment.jpg";
import herbalImg from "@/assets/herbal-medicine.jpg";
import cuppingImg from "@/assets/cupping-therapy.jpg";
import meditationImg from "@/assets/wellness-meditation.jpg";

const services = [
  {
    title: "Acupuncture",
    description:
      "Precision needle therapy targeting meridian points to restore energy flow, relieve chronic pain, reduce stress, and promote deep healing throughout the body.",
    image: acupunctureImg,
    alt: "Professional acupuncture treatment with fine needles for pain relief and healing",
  },
  {
    title: "Herbal Medicine",
    description:
      "Custom-blended traditional Chinese herbal formulas tailored to your unique constitution, supporting immune health, digestion, hormonal balance, and vitality.",
    image: herbalImg,
    alt: "Traditional Chinese herbal medicine preparation with natural healing herbs",
  },
  {
    title: "Cupping Therapy",
    description:
      "Therapeutic suction cups applied to relieve muscle tension, improve circulation, reduce inflammation, and accelerate recovery from injury and chronic conditions.",
    image: cuppingImg,
    alt: "Cupping therapy session for muscle relief and improved blood circulation",
  },
  {
    title: "Wellness & Mindfulness",
    description:
      "Guided holistic wellness practices including breathwork, meditation techniques, and lifestyle counseling to cultivate lasting mind-body harmony and emotional resilience.",
    image: meditationImg,
    alt: "Mindfulness meditation practice for holistic wellness and inner peace",
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
            Holistic Healing Services
          </h2>
          <p className="body-md text-muted-foreground max-w-2xl mx-auto">
            From acupuncture and herbal medicine to cupping therapy and wellness coaching, 
            our comprehensive treatments address the root cause of imbalance — not just the symptoms.
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
