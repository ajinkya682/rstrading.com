import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import all your modular sections
import CinematicHero from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import IncomeStructureSection from "./sections/IncomeStructureSection";
import EarningsCalculatorSection from "./sections/EarningsCalculatorSection";
import ReferralNetworkSection from "./sections/ReferralNetworkSection";
import TrustSection from "./sections/TrustSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FAQSection from "./sections/FAQSection";
import CTASection from "./sections/CTASection";

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Manrope, sans-serif",
        backgroundColor: "#030704",
        color: "#F8FAFC",
      }}
    >
      <Navbar />

      <CinematicHero />
      <StatsSection />
      <HowItWorksSection />

      <IncomeStructureSection />
      <EarningsCalculatorSection />
      <ReferralNetworkSection />

      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

      <Footer />
    </div>
  );
}
