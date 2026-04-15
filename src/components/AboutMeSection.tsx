import { Heart, Leaf, Shield, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import maxPhoto from "@/assets/max-wu.png";
import bambooBg from "@/assets/bamboo-bg.jpg";

const values = [
  { icon: Heart, title: "Compassionate Care", description: "Every treatment starts with listening to your unique health journey." },
  { icon: Leaf, title: "Natural Healing", description: "Time-tested traditional Chinese medicine techniques that support the body's innate healing." },
  { icon: Shield, title: "Evidence-Informed", description: "Ancient wisdom integrated with modern anatomy and physiology." },
  { icon: Sparkles, title: "Whole-Person Wellness", description: "We treat the complete person — body, mind, and spirit — not just isolated symptoms." },
];

const AboutMeSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bambooBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/97 dark:bg-background/98" />
      </div>

      <div className="relative max-w-7xl mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className={`bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-primary/10 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">About</p>
            <h2 className="heading-lg text-foreground mb-6">Meet Tzeyoung Max Wu, LAc</h2>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <div className="shrink-0">
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                  <img
                    src={maxPhoto}
                    alt="Max (Tzeyoung) Wu, Licensed Acupuncturist"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 body-md text-muted-foreground text-center sm:text-left">
                <p>
                  Max is a Licensed Acupuncturist (LAc) certified by the Virginia Board of Medicine. 
                  As a practitioner of integrative medicine, he works with each person as a whole 
                  rather than a sum of body parts.
                </p>
                <p>
                  Healing is a partnership between patient and practitioner, collaborating to improve 
                  lifestyle, mindset, as well as physical health.
                </p>
              </div>
            </div>

            <div className="space-y-4 body-md text-muted-foreground">
              <p>
                Max obtained a Master of Acupuncture degree at the Virginia University of 
                Integrative Medicine, and also completed graduate and academic degrees from the 
                University of Chicago, Virginia Tech, and New York University. He brings a wealth 
                of knowledge and life experience to his practice.
              </p>
              <p className="text-muted-foreground/80 italic">
                On the side, Max is a jazz musician and a martial artist — although that has all 
                been supplanted by his family and kids.
              </p>
              <p className="text-foreground font-medium">
                Most insurance carriers accepted.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-sm transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <value.icon className="w-7 h-7 text-primary mb-3" />
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
