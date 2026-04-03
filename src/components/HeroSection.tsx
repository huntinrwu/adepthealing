import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Serene acupuncture clinic environment representing holistic healing and balance in Herndon Virginia"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto pt-16 md:pt-0 animate-fade-in">
        <p className="text-primary-foreground/80 font-body text-sm tracking-[0.3em] uppercase mb-6">
          Acupuncture &bull; Herndon, VA
        </p>

        <h1 className="heading-xl text-primary-foreground mb-6">
          Restore. Rebalance. Heal.
        </h1>

        <p className="body-lg text-primary-foreground/90 max-w-2xl mx-auto mb-10">
          Adept Healing provides expert acupuncture in Herndon, Virginia.
          Relieve chronic pain, reduce stress, and nurture your body's
          natural healing power with personalized treatments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-primary text-primary-foreground px-6 py-3.5 md:px-8 md:py-4 rounded-full text-base md:text-lg font-display font-medium hover:opacity-90 transition-all duration-300 shadow-lg min-h-[48px] flex items-center justify-center"
          >
            Schedule Your Healing
          </Link>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="border-2 border-primary-foreground/50 text-primary-foreground px-6 py-3.5 md:px-8 md:py-4 rounded-full text-base md:text-lg font-display font-medium hover:bg-primary-foreground/10 transition-all duration-300 min-h-[48px] flex items-center justify-center"
          >
            Explore Services
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex items-start justify-center pt-2 animate-bounce-slow">
          <div className="w-1.5 h-1.5 bg-primary-foreground/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
