import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-sage-light">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
            Visit Us
          </p>
          <h2 className="heading-lg text-foreground mb-4">
            Begin Your Healing Journey
          </h2>
          <p className="body-md text-muted-foreground max-w-xl mx-auto">
            Ready to experience the transformative power of acupuncture? 
            Reach out to schedule your appointment at our Herndon, Virginia clinic.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { icon: MapPin, label: "Location", value: "1033 Sterling Road", sub: "Suite 105, Herndon, VA" },
            { icon: Phone, label: "Phone", value: "Call for appointment", sub: "" },
            { icon: Mail, label: "Email", value: "info@adepthealing.com", sub: "" },
            { icon: Clock, label: "Hours", value: "Saturday: By appointment", sub: "Mon–Fri & Sun: Closed" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 text-center shadow-sm"
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.value}</p>
              {item.sub && <p className="text-sm text-muted-foreground">{item.sub}</p>}
            </motion.div>
          ))}
        </div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden shadow-sm"
        >
          <iframe
            title="Adept Healing acupuncture clinic location in Herndon Virginia"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3101.5!2d-77.386!3d38.969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s1033+Sterling+Rd+Suite+105+Herndon+VA!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
