import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Adept Healing Acupuncture | Herndon VA</title>
        <meta name="description" content="Adept Healing's privacy policy and HIPAA Notice of Privacy Practices. Learn how we protect your health information." />
        <link rel="canonical" href="https://adepthealing.com/privacy" />
      </Helmet>
      <Navbar />
      <main className="pt-20 bg-background">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 animate-fade-in">
              <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Legal</p>
              <h1 className="heading-lg text-foreground mb-4">Privacy Policy & HIPAA Notice</h1>
              <p className="body-md text-muted-foreground">Effective Date: April 2025</p>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">
              <section>
                <h2 className="heading-md text-foreground mb-3">1. Overview</h2>
                <p>
                  Adept Healing ("we," "us," "our") is committed to protecting your privacy and 
                  the confidentiality of your protected health information (PHI) in accordance with 
                  the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and 
                  applicable Virginia state laws.
                </p>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">2. Information We Collect</h2>
                <p>We collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address.</li>
                  <li><strong>Health Information (PHI):</strong> Medical history, current medications, allergies, health conditions, treatment records, and related health data provided through our intake form or during treatment.</li>
                  <li><strong>Technical Data:</strong> IP address (for security and rate limiting purposes only — not linked to health records).</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">3. How We Use Your Information</h2>
                <p>Your information is used only for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Treatment:</strong> To provide, coordinate, and manage your acupuncture care.</li>
                  <li><strong>Payment:</strong> To process insurance claims and billing.</li>
                  <li><strong>Healthcare Operations:</strong> To manage our practice, improve quality of care, and comply with legal obligations.</li>
                  <li><strong>Communication:</strong> To respond to your inquiries and schedule appointments.</li>
                </ul>
                <p className="mt-3">
                  We will <strong>not</strong> sell, rent, or share your personal or health information 
                  with third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">4. Your Rights Under HIPAA</h2>
                <p>As a patient, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Access:</strong> Request a copy of your health records.</li>
                  <li><strong>Amendment:</strong> Request corrections to your health information if you believe it is inaccurate.</li>
                  <li><strong>Restriction:</strong> Request restrictions on certain uses and disclosures of your PHI.</li>
                  <li><strong>Confidential Communication:</strong> Request that we communicate with you through specific means or at specific locations.</li>
                  <li><strong>Accounting:</strong> Request an accounting of certain disclosures of your PHI.</li>
                  <li><strong>Breach Notification:</strong> Receive notification if a breach of your unsecured PHI occurs.</li>
                  <li><strong>Complaint:</strong> File a complaint with us or the U.S. Department of Health and Human Services if you believe your privacy rights have been violated.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">5. Data Security</h2>
                <p>
                  We implement appropriate technical and administrative safeguards to protect your 
                  information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Encrypted data transmission (HTTPS/TLS) for all form submissions.</li>
                  <li>Encrypted data storage at rest.</li>
                  <li>Role-based access controls limiting PHI access to authorized personnel only.</li>
                  <li>Rate limiting and bot protection on all forms.</li>
                  <li>Regular review of security practices.</li>
                </ul>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">6. Data Retention</h2>
                <p>
                  We retain patient health records in accordance with Virginia state law, which 
                  requires maintenance of adult patient records for a minimum of six (6) years 
                  from the last date of service.
                </p>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">7. Contact Us</h2>
                <p>
                  If you have questions about this privacy policy, wish to exercise any of your 
                  rights, or need a full copy of our Notice of Privacy Practices, please contact us:
                </p>
                <address className="mt-3 not-italic">
                  <p>Adept Healing</p>
                  <p>1033 Sterling Road, Suite 105</p>
                  <p>Herndon, VA</p>
                </address>
              </section>

              <section>
                <h2 className="heading-md text-foreground mb-3">8. Changes to This Policy</h2>
                <p>
                  We reserve the right to update this privacy policy. Changes will be posted on 
                  this page with an updated effective date. Continued use of our services 
                  constitutes acceptance of the updated policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
