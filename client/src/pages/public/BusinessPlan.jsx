import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import the new specific Hero for this page
import BusinessPlanHeroSection from "./sections/BusinessPlanHeroSection";

// Reuse the powerful, upgraded sections from the homepage!
import IncomeStructureSection from "./sections/IncomeStructureSection";
import EarningsCalculatorSection from "./sections/EarningsCalculatorSection";
import ReferralNetworkSection from "./sections/ReferralNetworkSection";

export default function BusinessPlan() {
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

      {/* 1. Page Title / Hero */}
      <BusinessPlanHeroSection />

      {/* 2. The dynamic level cards and your custom incometable.png */}
      <IncomeStructureSection />

      {/* 3. The interactive slider calculator */}
      <EarningsCalculatorSection />

      {/* 4. The visual SVG network explanation */}
      <ReferralNetworkSection />

      <Footer />
    </div>
  );
}
