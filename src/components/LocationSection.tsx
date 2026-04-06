import { MapPin, Clock } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const LocationSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="location" className="py-16 md:py-20 px-4 md:px-6 lg:px-12 bg-background">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Location</p>
          <h2 className="heading-lg text-foreground mb-8">Where to Find Us</h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-display font-medium text-foreground mb-1">Address</h3>
                <p className="text-sm text-muted-foreground">
                  1033 Sterling Road, Suite 105<br />
                  Herndon, VA
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-display font-medium text-foreground mb-1">Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Fri–Sun: By appointment<br />
                  Mon–Thu: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm">
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
      </div>
    </section>
  );
};

export default LocationSection;
