const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold">Adept Healing</h3>
            <p className="text-primary-foreground/60 text-sm mt-1">
              Acupuncture in Herndon, VA &bull; Most insurance accepted
            </p>
          </div>
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Adept Healing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
