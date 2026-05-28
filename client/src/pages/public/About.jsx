import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import AboutHeroSection from "./sections/AboutHeroSection";
import AboutStorySection from "./sections/AboutStorySection";
import AboutValuesSection from "./sections/AboutValuesSection";

export default function About() {
  // Scroll to top on mount so it doesn't load halfway down the page
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

      <AboutHeroSection />
      <AboutStorySection />
      <AboutValuesSection />

      <Footer />
    </div>
  );
}
