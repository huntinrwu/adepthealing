import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "After years of chronic back pain, Adept Healing gave me my life back. The acupuncture treatments were gentle yet incredibly effective. I finally feel like myself again.",
    rating: 5,
    condition: "Chronic Pain Relief",
  },
  {
    name: "James L.",
    text: "I was skeptical at first, but the holistic approach here changed everything. Not only did my migraines reduce dramatically, but my overall energy and sleep improved too.",
    rating: 5,
    condition: "Migraine & Sleep",
  },
  {
    name: "Maria C.",
    text: "The herbal medicine program combined with acupuncture helped me manage my anxiety naturally. The team is warm, knowledgeable, and truly cares about your well-being.",
    rating: 5,
    condition: "Anxiety & Stress",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
            Patient Stories
          </p>
          <h2 className="heading-lg text-foreground mb-4">
            Real Healing, Real Results
          </h2>
          <p className="body-md text-muted-foreground max-w-xl mx-auto">
            Hear from our patients who've experienced transformative relief through 
            acupuncture and holistic care at Adept Healing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="body-md text-foreground italic mb-6">"{t.text}"</p>
              <footer>
                <p className="font-display text-lg font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-primary">{t.condition}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
