import { useInView } from "@/hooks/useInView";

const conditions = [
  "Back pain & neck pain",
  "Migraines & headaches",
  "Sciatica & joint pain",
  "Stress & anxiety",
  "Insomnia & sleep issues",
  "Digestive problems",
  "Sports injuries",
  "General wellness",
];

const AboutAcupunctureSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="acupuncture" className="py-16 md:py-20 px-4 md:px-6 lg:px-12 bg-sage-light">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Acupuncture</p>
          <h2 className="heading-lg text-foreground mb-6">How Acupuncture Can Help</h2>
          <div className="space-y-4 body-md text-muted-foreground mb-8">
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

          <h3 className="font-display text-lg font-medium text-foreground mb-4">Conditions commonly treated:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conditions.map((condition, index) => (
              <li
                key={condition}
                className={`flex items-center gap-3 text-muted-foreground transition-all duration-500 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {condition}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutAcupunctureSection;
