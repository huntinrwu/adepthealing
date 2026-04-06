import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="font-display text-2xl font-semibold mb-3">Adept Healing</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Acupuncture in Herndon, Virginia.<br />
              Most insurance carriers accepted.
            </p>
            <address className="text-primary-foreground/60 text-sm mt-3 not-italic">
              1033 Sterling Road, Suite 105<br />
              Herndon, VA
            </address>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-3">Hours</h4>
            <p className="text-sm text-primary-foreground/70">Fri–Sun: By appointment</p>
            <p className="text-sm text-primary-foreground/70">Mon–Thu: Closed</p>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-3">Links</h4>
            <nav className="space-y-2">
              {[
                { label: "About", href: "#about" },
                { label: "Services", href: "#acupuncture" },
                { label: "Location", href: "#location" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link to="/intake" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Patient Intake Form
              </Link>
              <Link to="/privacy" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Adept Healing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
