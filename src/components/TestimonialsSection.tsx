import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Max helped me overcome years of chronic back pain. His treatments were gentle yet incredibly effective.",
    rating: 5,
    condition: "Chronic Pain Relief",
  },
  {
    name: "James L.",
    text: "I was skeptical at first, but Max's holistic approach changed everything. My migraines reduced dramatically.",
    rating: 5,
    condition: "Migraine & Sleep",
  },
  {
    name: "Maria C.",
    text: "Acupuncture helped me manage my anxiety naturally. Max is warm, skilled, and truly cares about your wellbeing.",
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
            Real results from our patients at Adept Healing.
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
            </motion.blockquote>
          ))}
        </div>

        {/* CTA after testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="heading-md text-foreground mb-3">Ready to start feeling better?</h3>
          <p className="body-md text-muted-foreground mb-6 max-w-lg mx-auto">
            Join hundreds of patients who have found relief through acupuncture. Your healing journey starts with one step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-medium hover:opacity-90 transition-opacity"
            >
              Schedule an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-display font-medium hover:bg-primary/5 transition-colors"
            >
              Have Questions? Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
