import { MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";

const ContactSection = () => {
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="section-padding bg-sage-light">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Visit Us</p>
          <h2 className="heading-lg text-foreground mb-4">Begin Your Healing Journey</h2>
          <p className="body-md text-muted-foreground max-w-xl mx-auto">Schedule your acupuncture appointment at our Herndon, Virginia clinic.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {[
            { icon: MapPin, label: "Location", value: "1033 Sterling Road", sub: "Suite 105, Herndon, VA" },
            { icon: Clock, label: "Hours", value: "Saturday: By appointment", sub: "Mon–Fri & Sun: Closed" },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`bg-background rounded-xl p-6 text-center shadow-sm transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.value}</p>
              {item.sub && <p className="text-sm text-muted-foreground">{item.sub}</p>}
            </div>
          ))}
          <div className={`bg-background rounded-xl p-6 text-center shadow-sm flex flex-col items-center justify-center transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "200ms" }}>
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Get In Touch</h3>
            <Link to="/contact" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              Contact Us
            </Link>
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
    </section>
  );
};

export default ContactSection;
