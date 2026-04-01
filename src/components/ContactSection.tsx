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
            Ready to experience the transformative power of acupuncture and holistic medicine? 
            Reach out to schedule your first appointment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: MapPin, label: "Location", value: "Contact us for our clinic address", sub: "" },
            { icon: Phone, label: "Phone", value: "Call for appointment", sub: "" },
            { icon: Mail, label: "Email", value: "info@adepthealing.com", sub: "" },
            { icon: Clock, label: "Hours", value: "Mon–Fri: 9am–6pm", sub: "Sat: 10am–3pm" },
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
      </div>
    </section>
  );
};

export default ContactSection;
