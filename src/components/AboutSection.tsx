import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description: "Every treatment starts with listening to your unique health journey.",
  },
  {
    icon: Leaf,
    title: "Natural Healing",
    description: "Time-tested traditional Chinese medicine techniques that support the body's innate healing.",
  },
  {
    icon: Shield,
    title: "Evidence-Informed",
    description: "Our practice integrates ancient wisdom with modern understanding of anatomy and physiology.",
  },
  {
    icon: Sparkles,
    title: "Whole-Person Wellness",
    description: "We treat the complete person — body, mind, and spirit — not just isolated symptoms.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-sage-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
              About Adept Healing
            </p>
            <h2 className="heading-lg text-foreground mb-6">
              Rooted in Tradition,<br /> Focused on You
            </h2>
            <p className="body-lg text-muted-foreground mb-6">
              At Adept Healing, we believe true wellness is a journey of balance and harmony. 
              Our licensed acupuncturists bring years of clinical experience and a deep reverence 
              for traditional Chinese medicine to every session.
            </p>
            <p className="body-md text-muted-foreground mb-8">
              Whether you're seeking relief from chronic pain, managing stress and anxiety, 
              addressing digestive issues, or improving sleep quality, our personalized treatment 
              plans are designed to restore your body's natural equilibrium and support 
              long-term vitality.
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 shadow-sm"
              >
                <value.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-xl font-medium text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
