import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const testimonials = [
  { name: "Sarah M.", text: "The team at Adept Healing helped me overcome years of chronic back pain. The treatments were gentle yet incredibly effective.", rating: 5, condition: "Chronic Pain Relief" },
  { name: "James L.", text: "I was skeptical at first, but the acupuncture treatments changed everything. My migraines reduced dramatically after just a few sessions.", rating: 5, condition: "Migraine Relief" },
  { name: "Maria C.", text: "Acupuncture helped me manage my anxiety naturally. The team is warm, skilled, and truly cares about your wellbeing.", rating: 5, condition: "Anxiety & Stress" },
  { name: "David R.", text: "After a sports injury left me with chronic knee pain, acupuncture at Adept Healing got me back on my feet. Highly recommend!", rating: 5, condition: "Sports Injury Recovery" },
  { name: "Linda K.", text: "I've struggled with insomnia for years. After consistent acupuncture sessions, I'm finally sleeping through the night again.", rating: 5, condition: "Sleep & Insomnia" },
  { name: "Robert T.", text: "The sciatica pain was unbearable. Acupuncture provided relief that physical therapy alone couldn't achieve. Life-changing experience.", rating: 5, condition: "Sciatica Relief" },
  { name: "Emily W.", text: "I came in for neck and shoulder tension from desk work. The difference after just three sessions was remarkable.", rating: 5, condition: "Neck & Shoulder Pain" },
  { name: "Michael H.", text: "Acupuncture helped with my digestive issues when nothing else worked. The care here is compassionate and professional.", rating: 5, condition: "Digestive Health" },
  { name: "Patricia S.", text: "I was dealing with constant headaches and fatigue. The acupuncture treatments gave me my energy and clarity back.", rating: 5, condition: "Headaches & Fatigue" },
];

const TestimonialsSection = () => {
  const { ref, inView } = useInView();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary font-body text-sm tracking-[0.25em] uppercase mb-4">Patient Stories</p>
          <h2 className="heading-lg text-foreground mb-4">Real Healing, Real Results</h2>
          <p className="body-md text-muted-foreground max-w-xl mx-auto">Real results from our patients at Adept Healing.</p>
        </div>

        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplayPlugin.current]}
            className="w-full px-4 md:px-12"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <blockquote className="bg-card rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="body-md text-foreground italic mb-6 flex-1">"{t.text}"</p>
                    <footer>
                      <p className="font-display text-lg font-semibold text-foreground">{t.name}</p>
                      <p className="text-sm text-primary">{t.condition}</p>
                    </footer>
                  </blockquote>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className={`mt-16 text-center transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="heading-md text-foreground mb-3">Ready to start feeling better?</h3>
          <p className="body-md text-muted-foreground mb-6 max-w-lg mx-auto">Join hundreds of patients who have found relief through acupuncture. Your healing journey starts with one step.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-display font-medium hover:opacity-90 transition-opacity">
              Schedule an Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-display font-medium hover:bg-primary/5 transition-colors">
              Have Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
