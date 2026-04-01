import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">Adept Healing</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Expert acupuncture and holistic wellness services in Herndon, Virginia. 
              Restoring balance and vitality through compassionate, evidence-informed 
              acupuncture care.
            </p>
            <address className="text-primary-foreground/60 text-sm mt-4 not-italic leading-relaxed">
              1033 Sterling Road, Suite 105<br />
              Herndon, VA
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Quick Links</h4>
            <nav className="space-y-2">
              {["Services", "About", "Testimonials"].map((link) => (
                <a
                  key={link}
                  href={`/#${link.toLowerCase()}`}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
              <Link
                to="/contact"
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/areas-we-serve"
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Areas We Serve
              </Link>
              <Link
                to="/acupuncture-fairfax-county-va"
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Fairfax County Acupuncture
              </Link>
              <Link
                to="/intake"
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Patient Intake Form
              </Link>
            </nav>
          </div>

          {/* Acupuncture Services SEO */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Acupuncture For</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Chronic Pain & Back Pain</li>
              <li>Migraines & Headaches</li>
              <li>Stress & Anxiety Relief</li>
              <li>Digestive & General Wellness</li>
              <li>Sports Injury Recovery</li>
              <li>Insomnia & Sleep Issues</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Adept Healing. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/40">
            Acupuncture &bull; Herndon, VA &bull; Holistic Wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
