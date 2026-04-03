import { Heart, Leaf, Shield, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const values = [
  { icon: Heart, title: "Compassionate Care", description: "Every treatment starts with listening to your unique health journey." },
  { icon: Leaf, title: "Natural Healing", description: "Time-tested traditional Chinese medicine techniques that support the body's innate healing." },
  { icon: Shield, title: "Evidence-Informed", description: "Ancient wisdom integrated with modern anatomy and physiology." },
  { icon: Sparkles, title: "Whole-Person Wellness", description: "We treat the complete person — body, mind, and spirit — not just isolated symptoms." },
];

const AboutSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section-padding bg-sage-light">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">About Adept Healing</p>
            <h2 className="heading-lg text-foreground mb-6">Rooted in Tradition,<br /> Focused on You</h2>
            <p className="body-lg text-muted-foreground mb-6">
              With over a decade of clinical experience and a deep reverence for
              traditional Chinese medicine, we bring expert care to every session.
            </p>
            <p className="body-md text-muted-foreground mb-8">
              Whether you're managing chronic pain, stress, digestive issues, or sleep quality —
              our personalized plans restore balance and support long-term vitality.
            </p>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`bg-background rounded-xl p-6 shadow-sm transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <value.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-xl font-medium text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
