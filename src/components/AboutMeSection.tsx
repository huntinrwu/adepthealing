import { useInView } from "@/hooks/useInView";

const AboutMeSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 lg:px-12 bg-background">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">About</p>
          <h1 className="heading-lg text-foreground mb-6">Hi, I'm Max</h1>
          <div className="space-y-4 body-md text-muted-foreground">
            <p>
              I'm a licensed acupuncturist with over a decade of clinical experience. 
              I practice in Herndon, Virginia, and treat patients from across Fairfax County, 
              Northern Virginia, and the DC metro area.
            </p>
            <p>
              My approach is rooted in traditional Chinese medicine with a focus on treating 
              the whole person — not just symptoms. Whether you're dealing with chronic pain, 
              stress, digestive issues, or sleep problems, I work with you to create a 
              personalized treatment plan.
            </p>
            <p className="text-foreground font-medium">
              Most insurance carriers accepted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
