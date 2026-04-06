import { useInView } from "@/hooks/useInView";
import zenStonesBg from "@/assets/zen-stones-bg.jpg";

const conditions = [
  "Back pain & neck pain",
  "Migraines & headaches",
  "Sciatica & joint pain",
  "Stress & anxiety",
  "Insomnia & sleep issues",
  "Digestive problems",
  "Sports injuries & recovery",
  "General wellness",
];

const AboutAcupunctureSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="acupuncture" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={zenStonesBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-sage-light/90 dark:bg-background/90" />
      </div>

      <div className="relative max-w-7xl mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Services</p>
            <h2 className="heading-lg text-foreground mb-6">How Acupuncture Can Help</h2>
            <div className="space-y-4 body-md text-muted-foreground">
              <p>
                Acupuncture is a time-tested practice that uses fine needles to stimulate 
                specific points on the body, promoting natural healing and pain relief. 
                It's safe, effective, and backed by a growing body of modern research.
              </p>
              <p>
                Each session is tailored to your individual needs. Many patients feel 
                improvement after just a few treatments.
              </p>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-display text-lg font-medium text-foreground mb-5">Conditions commonly treated</h3>
              <ul className="space-y-3">
                {conditions.map((condition, index) => (
                  <li
                    key={condition}
                    className={`flex items-center gap-3 text-muted-foreground transition-all duration-500 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                    style={{ transitionDelay: `${300 + index * 50}ms` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAcupunctureSection;
