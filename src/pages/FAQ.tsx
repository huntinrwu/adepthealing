import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is acupuncture and how does it work?",
    answer:
      "Acupuncture involves inserting thin, sterile needles into specific meridian points to stimulate healing, promote Qi flow, reduce inflammation, and release endorphins. Recognized by the WHO for treating numerous conditions, it's been practiced for over 3,000 years.",
  },
  {
    question: "Does acupuncture hurt?",
    answer:
      "Most patients feel little to no pain. The needles are extremely thin — much thinner than a hypodermic needle. You may feel a slight tingling or warmth, which means the treatment is working. Many patients find it deeply relaxing.",
  },
  {
    question: "What conditions can acupuncture treat?",
    answer:
      "Acupuncture is effective for a wide range of conditions including chronic pain (back pain, neck pain, knee pain), migraines and headaches, stress and anxiety, insomnia, digestive disorders (IBS, acid reflux), allergies, sports injuries, sciatica, carpal tunnel syndrome, TMJ, and post-surgical recovery. It's also excellent for general wellness and preventive care.",
  },
  {
    question: "How many acupuncture sessions will I need?",
    answer:
      "It depends on your condition and severity. Acute issues may respond in 3–6 sessions; chronic conditions typically need 8–12 or more. We'll create a personalized plan during your initial consultation.",
  },
  {
    question: "Is acupuncture safe?",
    answer:
      "Yes, acupuncture is very safe when performed by a licensed, trained acupuncturist. We use only sterile, single-use, disposable needles. Side effects are rare and typically minor, such as slight bruising at a needle site. Acupuncture is a drug-free therapy with no risk of addiction or dangerous interactions with medications.",
  },
  {
    question: "What should I expect during my first acupuncture visit?",
    answer:
      "Your first visit includes a comprehensive health assessment where we discuss your medical history, current symptoms, lifestyle, diet, and wellness goals. We'll examine your tongue, check your pulse, and develop a personalized treatment plan. The first session typically lasts 60–90 minutes. You can fill out our New Patient Intake Form online before your visit to save time.",
  },
  {
    question: "Does insurance cover acupuncture?",
    answer:
      "Yes! We accept most major insurance plans for acupuncture treatments. Coverage varies by provider and plan, so we recommend contacting your insurance company to verify your specific acupuncture benefits. Our team can also help verify your coverage before your first visit. For plans we don't directly bill, we can provide you with a superbill (detailed receipt) that you can submit to your insurance for reimbursement.",
  },
  {
    question: "How should I prepare for an acupuncture session?",
    answer:
      "Eat a light meal 1–2 hours before your appointment — don't come on an empty stomach. Wear loose, comfortable clothing that can be rolled up above your elbows and knees. Avoid caffeine and alcohol before your session. Stay hydrated. After treatment, rest and drink plenty of water to support your body's healing response.",
  },
  {
    question: "Where is your acupuncture clinic located?",
    answer:
      "Adept Healing is located at 1033 Sterling Road, Suite 105, Herndon, VA. We serve patients throughout Northern Virginia including Reston, Sterling, Ashburn, Leesburg, Chantilly, Centreville, Fairfax, and the greater Washington DC metropolitan area. We're open on Saturdays by appointment.",
  },
  {
    question: "Can acupuncture help with anxiety and depression?",
    answer:
      "Acupuncture has shown promising results for anxiety and depression. It helps regulate the nervous system, reduce cortisol levels, and stimulate the production of serotonin and endorphins — neurotransmitters associated with mood regulation. Many patients report feeling calmer, more focused, and emotionally balanced after regular acupuncture sessions.",
  },
  {
    question: "Is acupuncture effective for back pain and sciatica?",
    answer:
      "Acupuncture is one of the most well-researched and effective treatments for back pain and sciatica. The American College of Physicians recommends acupuncture as a first-line treatment for chronic low back pain. It reduces inflammation, relaxes tight muscles, improves circulation, and stimulates the body's natural pain-relief mechanisms.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>Acupuncture FAQ | Common Questions | Adept Healing Herndon VA</title>
        <meta
          name="description"
          content="Frequently asked questions about acupuncture at Adept Healing in Herndon, VA. Learn about acupuncture benefits, what to expect, pain relief, insurance coverage, and more."
        />
        <meta
          name="keywords"
          content="acupuncture FAQ, acupuncture questions, does acupuncture hurt, acupuncture benefits, acupuncture for pain, acupuncture for anxiety, acupuncture Herndon VA, acupuncture Northern Virginia, acupuncture insurance, first acupuncture visit, acupuncture safety"
        />
        <meta property="og:title" content="Acupuncture FAQ | Adept Healing | Herndon VA" />
        <meta
          property="og:description"
          content="Get answers to common acupuncture questions. Learn what to expect, conditions treated, and how acupuncture can help you heal naturally."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adepthealing.com/faq" />
        <link rel="canonical" href="https://adepthealing.com/faq" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-20">
        <section className="section-padding bg-sage-light">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">
                Frequently Asked Questions
              </p>
              <h1 className="heading-lg text-foreground mb-4">
                Acupuncture Questions & Answers
              </h1>
              <p className="body-md text-muted-foreground max-w-xl mx-auto">
                Everything you need to know about acupuncture treatments at Adept Healing 
                in Herndon, Virginia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="bg-background rounded-xl px-6 border-none shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-display text-foreground hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground body-md leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-16"
            >
              <p className="body-md text-muted-foreground mb-6">
                Still have questions? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/intake"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Book an Appointment
                </Link>
                <a
                  href="/#contact"
                  className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary/10 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
