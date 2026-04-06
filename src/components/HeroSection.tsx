import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Serene acupuncture clinic environment in Herndon Virginia"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      <div className="relative z-10 text-center px-4 md:px-6 max-w-3xl mx-auto pt-16 md:pt-0 animate-fade-in">
        <h1 className="heading-xl text-primary-foreground mb-4">
          Adept Healing
        </h1>
        <p className="body-lg text-primary-foreground/90 max-w-xl mx-auto mb-8">
          Acupuncture in Herndon, Virginia. Pain relief, stress management, 
          and whole-person care — most insurance carriers accepted.
        </p>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-block bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-lg font-display font-medium hover:opacity-90 transition-all duration-300 shadow-lg"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
