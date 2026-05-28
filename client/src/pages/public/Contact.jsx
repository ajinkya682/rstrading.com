import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Import modular sections
import ContactHeroSection from "./sections/ContactHeroSection";
import ContactFormSection from "./sections/ContactFormSection";

export default function Contact() {
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
      <ContactHeroSection />

      {/* Premium Dark Mode Form & Contact Info */}
      <ContactFormSection />

      <Footer />
    </div>
  );
}
