import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import our modular sections
import HowItWorksHeroSection from "./sections/HowItWorksHeroSection";
import HowItWorksDetailedSection from "./sections/HowItWorksDetailedSection";

// Reuse the powerful CTA section we built earlier!
import CTASection from "./sections/CTASection";

export default function HowItWorks() {
  // Ensure the page loads at the very top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Manrope, sans-serif",
        backgroundColor: "#030704",
        color: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* Cinematic Page Title */}
      <HowItWorksHeroSection />

      {/* Vertical Premium Timeline */}
      <HowItWorksDetailedSection />

      {/* Ready to start block */}
      <CTASection />

      <Footer />
    </div>
  );
}
