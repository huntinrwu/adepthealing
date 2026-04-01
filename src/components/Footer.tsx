import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">Adept Healing</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Expert acupuncture, traditional Chinese medicine, herbal therapy, and holistic 
              wellness services. Restoring balance and vitality through compassionate, 
              evidence-informed care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {["Services", "About", "Testimonials", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`/#${link.toLowerCase()}`}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
              <Link
                to="/intake"
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                New Patient Intake Form
              </Link>
            </nav>
          </div>

          {/* Services SEO */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Our Treatments</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Acupuncture for Pain Relief</li>
              <li>Chinese Herbal Medicine</li>
              <li>Cupping & Moxibustion</li>
              <li>Stress & Anxiety Management</li>
              <li>Fertility & Women's Health</li>
              <li>Sports Injury Recovery</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Adept Healing. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/40">
            Acupuncture &bull; Traditional Chinese Medicine &bull; Holistic Wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
