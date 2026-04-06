import { MapPin, Clock } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import zenGardenBg from "@/assets/zen-garden-bg.jpg";

const LocationSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="location" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={zenGardenBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/92 dark:bg-background/95" />
      </div>

      <div className="relative max-w-7xl mx-auto" ref={ref}>
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Visit</p>
          <h2 className="heading-lg text-foreground mb-4">Where to Find Us</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
          <div className={`bg-card/95 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <MapPin className="w-7 h-7 text-primary mx-auto mb-3" />
            <h3 className="font-display text-lg font-medium text-foreground mb-2">Location</h3>
            <p className="text-sm text-muted-foreground">1033 Sterling Road, Suite 105</p>
            <p className="text-sm text-muted-foreground">Herndon, VA</p>
          </div>
          <div className={`bg-card/95 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "100ms" }}>
            <Clock className="w-7 h-7 text-primary mx-auto mb-3" />
            <h3 className="font-display text-lg font-medium text-foreground mb-2">Hours</h3>
            <p className="text-sm text-muted-foreground">Fri–Sun: By appointment</p>
            <p className="text-sm text-muted-foreground">Mon–Thu: Closed</p>
          </div>
        </div>

        <div className={`rounded-2xl overflow-hidden shadow-sm transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <iframe
            title="Adept Healing acupuncture clinic location in Herndon Virginia"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3101.5!2d-77.386!3d38.969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s1033+Sterling+Rd+Suite+105+Herndon+VA!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%"
            height="250"
            className="md:h-[350px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
