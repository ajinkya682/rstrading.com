import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";

// Import your local banner images
import banner1 from "@/assets/images/branner1.png";
import banner2 from "@/assets/images/banner2.png";

// Centralized slide data
const slides = [
  {
    id: 1,
    bgImage: banner1,
    tag: "India's Premium Business Network",
    titleLine1: "Grow Your Business.",
    titleLine2: "Build Your Future.",
    highlightColor: "#10B981", // Emerald highlight
    desc: "Join RS Trading's structured referral income platform. Build a team, progress through 9 income levels, and earn consistent payouts with complete transparency.",
    primaryBtn: "Get Started Free",
    secondaryBtn: "View Business Plan",
  },
  {
    id: 2,
    bgImage: banner2,
    tag: "Next-Generation Dashboard",
    titleLine1: "Your Growth.",
    titleLine2: "Your Dashboard.",
    highlightColor: "#D4AF37", // Gold highlight
    desc: "Track your earnings in real-time. Experience complete control with our advanced tracking systems, instant payout unlocks, and deep network insights.",
    primaryBtn: "Access Dashboard",
    secondaryBtn: "See How It Works",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export default function CinematicHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const setSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="cinematic-hero">
      {/* 1. BACKGROUND IMAGE LAYER (Crossfading) */}
      <div className="background-layer">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={slides[currentIndex].bgImage}
            alt="RS Trading Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="bg-image"
          />
        </AnimatePresence>

        {/* Deep gradient overlay to ensure text is always readable over complex images */}
        <div className="bg-gradient-overlay" />
      </div>

      {/* 2. DYNAMIC TEXT CONTENT LAYER */}
      <div className="content-layer">
        <div className="content-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-content"
            >
              <div className="premium-tag">
                <span
                  className="pulse-dot"
                  style={{
                    backgroundColor: slides[currentIndex].highlightColor,
                    boxShadow: `0 0 10px ${slides[currentIndex].highlightColor}`,
                  }}
                />
                {slides[currentIndex].tag}
              </div>

              <h1 className="hero-heading">
                {slides[currentIndex].titleLine1}
                <br />
                <span style={{ color: slides[currentIndex].highlightColor }}>
                  {slides[currentIndex].titleLine2}
                </span>
              </h1>

              <p className="hero-subtext">{slides[currentIndex].desc}</p>

              <div className="hero-buttons">
                <Link to="/register" className="btn-cinematic-primary">
                  {slides[currentIndex].primaryBtn} <ArrowRight size={18} />
                </Link>
                <Link to="/business-plan" className="btn-cinematic-outline">
                  <Play size={16} fill="currentColor" />{" "}
                  {slides[currentIndex].secondaryBtn}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="trust-indicators">
                <div className="avatar-group-premium">
                  {["RS", "PP", "AK", "MB", "SK"].map((init, i) => (
                    <div key={i} className={`avatar-premium bg-color-${i + 1}`}>
                      {init}
                    </div>
                  ))}
                </div>

                <div className="trust-text-container">
                  <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} fill="#D4AF37" color="#D4AF37" />
                    ))}
                  </div>
                  <span>
                    Trusted by <strong>50,000+</strong> members
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. PREMIUM SLIDER CONTROLS (Animated Progress Bars) */}
      <div className="slider-controls">
        <div className="controls-container">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className="progress-track"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                animate={{
                  width:
                    currentIndex === idx
                      ? "100%"
                      : currentIndex > idx
                        ? "100%"
                        : "0%",
                }}
                transition={{
                  duration:
                    currentIndex === idx ? AUTOPLAY_INTERVAL / 1000 : 0.3,
                  ease: "linear",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* GLOBAL / COMPONENT STYLES */}
      <style>{`
        .cinematic-hero {
          position: relative;
          width: 100%;
          height: 100vh; /* Full screen height */
          min-height: 700px;
          overflow: hidden;
          background-color: #030704;
          font-family: "Satoshi", "Manrope", sans-serif;
        }

        /* Background Image & Overlay */
        .background-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .bg-image {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .bg-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(3,7,4,0.98) 0%, rgba(3,7,4,0.85) 40%, rgba(3,7,4,0.1) 100%);
          z-index: 2;
        }

        /* Content Positioning */
        .content-layer {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 10;
          display: flex;
          align-items: center;
        }

        .content-container {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .text-content {
          max-width: 650px; /* Constrain text to the left side */
        }

        /* Typography */
        .premium-tag {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .hero-heading {
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          color: #FFFFFF;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }

        .hero-subtext {
          font-size: 18px;
          color: #CBD5E1;
          line-height: 1.7;
          margin-bottom: 40px;
          font-weight: 400;
        }

        /* Premium Buttons */
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .btn-cinematic-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: #030704;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-cinematic-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255,255,255,0.2);
        }

        .btn-cinematic-outline {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          color: #fff;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .btn-cinematic-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }

        /* Trust Indicators & Premium Avatars */
        .trust-indicators {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: #94A3B8;
          margin-top: 12px;
        }

        .avatar-group-premium {
          display: flex;
          align-items: center;
        }

        .avatar-premium {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          border: 2px solid #030704; 
          margin-left: -12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          position: relative;
          transition: transform 0.2s ease, z-index 0.2s ease;
        }

        .avatar-premium:first-child {
          margin-left: 0;
        }

        .avatar-premium:hover {
          transform: translateY(-4px) scale(1.1);
          z-index: 10;
        }

        .trust-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .trust-text-container span {
          line-height: 1;
        }

        .trust-text-container strong {
          color: #fff;
          font-weight: 800;
        }

        /* Avatar Brand Colors */
        .bg-color-1 { background: linear-gradient(135deg, #10B981, #059669); }
        .bg-color-2 { background: linear-gradient(135deg, #1E3A5F, #0F172A); }
        .bg-color-3 { background: linear-gradient(135deg, #D4AF37, #B4942A); }
        .bg-color-4 { background: linear-gradient(135deg, #6366F1, #4338CA); }
        .bg-color-5 { background: linear-gradient(135deg, #EC4899, #BE185D); }

        /* Bottom Slider Progress Bars */
        .slider-controls {
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          z-index: 20;
        }
        
        .controls-container {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          gap: 12px;
        }

        .progress-track {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #fff;
          border-radius: 2px;
        }

        /* =========================================
           CRITICAL MOBILE GAP FIX
           ========================================= */
        @media (max-width: 968px) {
          .bg-gradient-overlay {
            background: linear-gradient(180deg, rgba(3,7,4,0.4) 0%, rgba(3,7,4,0.95) 45%, #030704 100%);
          }
          
          .content-layer {
            /* THIS IS THE MAGIC GAP! Pushes content down below the navbar */
            padding-top: 140px; 
            padding-bottom: 100px;
            align-items: flex-start; 
          }
          
          .text-content {
            max-width: 100%;
            text-align: left;
          }
          
          .hero-heading {
            font-size: clamp(38px, 10vw, 48px);
          }
          
          .hero-buttons {
            flex-direction: column;
          }
          
          .btn-cinematic-primary, .btn-cinematic-outline {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
