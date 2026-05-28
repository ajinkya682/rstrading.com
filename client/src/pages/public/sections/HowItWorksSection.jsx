import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

// Assuming you import your data from constants.
// Adjust the path if necessary for your project structure.
import { HOW_IT_WORKS } from "@/constants/planData";

// ===== FADE IN HELPER =====
function FadeIn({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ===== MAIN COMPONENT =====
export default function HowItWorksSection() {
  // Fallback data just in case the import isn't available in your exact path
  const stepsData = HOW_IT_WORKS || [
    {
      step: 1,
      title: "Create Account",
      desc: "Sign up for free and get access to your personalized dashboard.",
    },
    {
      step: 2,
      title: "Activate Plan",
      desc: "Choose your starting level and activate your RS Trading account.",
    },
    {
      step: 3,
      title: "Build Team",
      desc: "Share your referral link and start building your network.",
    },
    {
      step: 4,
      title: "Earn & Grow",
      desc: "Unlock higher levels and earn consistent payouts automatically.",
    },
  ];

  return (
    <section className="premium-how-it-works">
      {/* Background ambient glows */}
      <div className="ambient-glow glow-left" />
      <div className="ambient-glow glow-right" />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <FadeIn>
            <div className="premium-tag-center">
              <CheckCircle size={14} color="#D4AF37" /> Simple Process
            </div>
            <h2 className="section-heading-premium">How It Works</h2>
            <p className="section-subtext-premium">
              Getting started with RS Trading is simple. Follow these 4 steps to
              start building your income.
            </p>
          </FadeIn>
        </div>

        {/* Steps Grid container with connecting line */}
        <div className="steps-container">
          {/* The glowing track line that connects the steps on desktop */}
          <div className="connecting-track" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 32,
              position: "relative",
            }}
          >
            {stepsData.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.15}>
                <div className="step-card-premium group">
                  {/* Glowing Step Number */}
                  <div className="step-number-wrapper">
                    <div className="step-number-glow" />
                    <div className="step-number-inner">{step.step}</div>
                  </div>

                  {/* Step Content */}
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>

                  {/* Decorative corner accent */}
                  <div className="card-accent" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* COMPONENT STYLES */}
      <style>{`
        .premium-how-it-works {
          background-color: #030704; /* Syncs perfectly with the dark theme */
          padding: 100px 0;
          position: relative;
          overflow: hidden;
          font-family: "Satoshi", "Manrope", sans-serif;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        /* Header Styles */
        .premium-tag-center {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .section-heading-premium {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 900;
          color: #FFFFFF;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .section-subtext-premium {
          font-size: 17px;
          color: #94A3B8;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Track Line connecting the cards */
        .steps-container {
          position: relative;
        }

        .connecting-track {
          position: absolute;
          top: 36px; /* Aligns with the center of the step numbers */
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.3) 20%, rgba(212,175,55,0.3) 80%, rgba(212,175,55,0) 100%);
          z-index: 1;
        }

        /* Glassmorphic Step Cards */
        .step-card-premium {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 40px 28px 32px;
          backdrop-filter: blur(12px);
          text-align: center;
          position: relative;
          transition: all 0.4s ease;
          z-index: 2; /* Sits above the track line */
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-card-premium:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-8px);
          border-color: rgba(16, 185, 129, 0.2);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }

        /* Step Numbers */
        .step-number-wrapper {
          position: relative;
          width: 72px;
          height: 72px;
          margin-bottom: 24px;
        }

        .step-number-inner {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #030704, #0F172A);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 900;
          color: #fff;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .step-number-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #10B981, #D4AF37);
          border-radius: 50%;
          filter: blur(12px);
          opacity: 0.3;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .step-card-premium:hover .step-number-inner {
          border-color: #10B981;
          box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2);
        }
        
        .step-card-premium:hover .step-number-glow {
          opacity: 0.7;
        }

        /* Typography Inside Cards */
        .step-title {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        .step-desc {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.6;
        }

        /* Corner Accent styling for luxury feel */
        .card-accent {
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 70%);
          border-top-right-radius: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .step-card-premium:hover .card-accent {
          opacity: 1;
        }

        /* Ambient Background Lighting */
        .ambient-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          pointer-events: none;
          z-index: 0;
        }
        .glow-left {
          top: -100px;
          left: -200px;
          background: #10B981;
        }
        .glow-right {
          bottom: -100px;
          right: -200px;
          background: #D4AF37;
        }

        /* Mobile Adjustments */
        @media (max-width: 968px) {
          .connecting-track {
            display: none; /* Hide horizontal track on mobile grids */
          }
          .step-card-premium {
            padding: 32px 24px 24px;
          }
          .premium-how-it-works {
            padding: 80px 0;
          }
        }
      `}</style>
    </section>
  );
}
