import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  { name: "Sarah M.", text: "Max helped me overcome years of chronic back pain. His treatments were gentle yet incredibly effective.", rating: 5, condition: "Chronic Pain Relief" },
  { name: "James L.", text: "I was skeptical at first, but Max's acupuncture treatments changed everything. My migraines reduced dramatically.", rating: 5, condition: "Migraine & Sleep" },
  { name: "Maria C.", text: "Acupuncture helped me manage my anxiety naturally. Max is warm, skilled, and truly cares about your wellbeing.", rating: 5, condition: "Anxiety & Stress" },
];

const TestimonialsSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Patient Stories</p>
          <h2 className="heading-lg text-foreground mb-4">Real Healing, Real Results</h2>
          <p className="body-md text-muted-foreground max-w-xl mx-auto">Real results from our patients at Adept Healing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {testimonials.map((t, index) => (
            <blockquote
              key={t.name}
              className={`bg-card rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
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

        <div className={`mt-16 text-center transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="heading-md text-foreground mb-3">Ready to start feeling better?</h3>
          <p className="body-md text-muted-foreground mb-6 max-w-lg mx-auto">Join hundreds of patients who have found relief through acupuncture. Your healing journey starts with one step.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-medium hover:opacity-90 transition-opacity">
              Schedule an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-display font-medium hover:bg-primary/5 transition-colors">
              Have Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
