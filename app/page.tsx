import Nav from "./components/Nav";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CurriculumSection from "./components/CurriculumSection";
import MentorSection from "./components/MentorSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-body, sans-serif)", overflowX: "hidden" }}>
      <Nav />
      <HeroSection />
      <FeaturesSection />
      <CurriculumSection />
      <MentorSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
