import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { question: "What is acupuncture and how does it work?", answer: "Acupuncture involves inserting thin, sterile needles into specific meridian points to stimulate healing, promote Qi flow, reduce inflammation, and release endorphins. Recognized by the WHO for treating numerous conditions, it's been practiced for over 3,000 years." },
  { question: "Does acupuncture hurt?", answer: "Most patients feel little to no pain. The needles are extremely thin — much thinner than a hypodermic needle. You may feel a slight tingling or warmth, which means the treatment is working. Many patients find it deeply relaxing." },
  { question: "What conditions can acupuncture treat?", answer: "Acupuncture is effective for chronic pain (back, neck, knee), migraines and headaches, stress and anxiety, insomnia, digestive disorders, allergies, sports injuries, sciatica, carpal tunnel syndrome, TMJ, and post-surgical recovery." },
  { question: "How many acupuncture sessions will I need?", answer: "It depends on your condition. Acute issues may respond in 3–6 sessions; chronic conditions typically need 8–12 or more. We'll create a personalized plan during your initial consultation." },
  { question: "Is acupuncture safe?", answer: "Yes. We use sterile, single-use, disposable needles. Side effects are rare and minor. Acupuncture is drug-free with no risk of addiction or medication interactions." },
  { question: "What should I expect during my first acupuncture visit?", answer: "Your first visit includes a health assessment covering medical history, symptoms, and wellness goals. We'll check your pulse, examine your tongue, and create a treatment plan. First sessions run 60–90 minutes." },
  { question: "Does insurance cover acupuncture?", answer: "Yes! We accept most major insurance plans. Coverage varies, so contact your provider to verify benefits — our team can help. For plans we don't bill directly, we provide a superbill for reimbursement." },
  { question: "How should I prepare for an acupuncture session?", answer: "Eat a light meal 1–2 hours before. Wear loose clothing. Avoid caffeine and alcohol. Stay hydrated, and rest after treatment." },
  { question: "Where is your acupuncture clinic located?", answer: "We're at 1033 Sterling Road, Suite 105, Herndon, VA — serving Reston, Sterling, Ashburn, Leesburg, Chantilly, Fairfax, and the greater DC area. Open Saturdays by appointment." },
  { question: "Can acupuncture help with anxiety and depression?", answer: "Yes. Acupuncture helps regulate the nervous system, lower cortisol, and boost serotonin and endorphins. Patients report feeling calmer, more focused, and emotionally balanced." },
  { question: "Is acupuncture effective for back pain and sciatica?", answer: "Absolutely. The American College of Physicians recommends acupuncture as a first-line treatment for chronic low back pain. It reduces inflammation, relaxes tight muscles, and stimulates natural pain relief." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
};

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>Acupuncture FAQ | Common Questions | Adept Healing Herndon VA</title>
        <meta name="description" content="Frequently asked questions about acupuncture at Adept Healing in Herndon, VA. Learn about benefits, what to expect, pain relief, insurance coverage, and more." />
        <meta name="keywords" content="acupuncture FAQ, acupuncture questions, does acupuncture hurt, acupuncture benefits, acupuncture Herndon VA" />
        <meta property="og:title" content="Acupuncture FAQ | Adept Healing | Herndon VA" />
        <meta property="og:description" content="Get answers to common acupuncture questions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adepthealing.com/faq" />
        <link rel="canonical" href="https://adepthealing.com/faq" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-sage-light">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Frequently Asked Questions</p>
              <h1 className="heading-lg text-foreground mb-4">Acupuncture Questions & Answers</h1>
              <p className="body-md text-muted-foreground max-w-xl mx-auto">Everything you need to know about acupuncture treatments at Adept Healing in Herndon, Virginia.</p>
            </div>

            <div className="animate-fade-in-up">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-background rounded-xl px-6 border-none shadow-sm">
                    <AccordionTrigger className="text-left font-display text-foreground hover:no-underline py-5">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground body-md leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="text-center mt-16">
              <p className="body-md text-muted-foreground mb-6">Still have questions? We'd love to hear from you.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/intake" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">Book an Appointment</Link>
                <a href="/#contact" className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
