import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function FadeIn({ children, delay = 0, x = 0, y = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutStorySection() {
  const stats = [
    { label: "Founded", value: "2021" },
    { label: "Members", value: "50K+" },
    { label: "States Covered", value: "28" },
    { label: "Total Payout", value: "₹10Cr+" },
  ];

  return (
    <section className="story-section">
      <div className="container">
        <div className="story-grid">
          {/* Left Text Column */}
          <FadeIn x={-30}>
            <h2 className="story-heading">Our Story</h2>
            <div className="heading-underline" />
            <p className="story-text">
              RS Trading was born from the belief that financial opportunity
              should not be limited to the few. Our founders, experienced in
              digital commerce and network marketing, created a platform where
              effort is directly rewarded.
            </p>
            <p className="story-text">
              Today, we serve over 50,000 members across India, with a track
              record of <strong style={{ color: "#10B981" }}>₹10 Crore+</strong>{" "}
              paid out in legitimate income to our active community members. We
              are redefining what a structured income platform looks like.
            </p>
          </FadeIn>

          {/* Right Stats Grid */}
          <FadeIn x={30} delay={0.2}>
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={s.label} className="glass-stat-card">
                  <div className="stat-glow" />
                  <p className="stat-value">{s.value}</p>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        .story-section { padding: 100px 24px; background-color: #030704; position: relative; }
        .container { max-width: 1200px; margin: 0 auto; }
        
        .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; alignItems: center; }
        @media (max-width: 968px) { .story-grid { grid-template-columns: 1fr; gap: 48px; } }

        .story-heading { font-size: 36px; font-weight: 900; color: #FFF; margin-bottom: 16px; letter-spacing: -0.02em; }
        .heading-underline { width: 60px; height: 4px; background: linear-gradient(90deg, #10B981, #D4AF37); border-radius: 2px; margin-bottom: 24px; }
        
        .story-text { color: #94A3B8; line-height: 1.8; font-size: 16px; margin-bottom: 20px; }
        .story-text:last-child { margin-bottom: 0; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        
        .glass-stat-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          padding: 32px 24px;
          text-align: center;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .glass-stat-card:hover { transform: translateY(-5px); border-color: rgba(212, 175, 55, 0.3); }

        .stat-glow {
          position: absolute;
          bottom: 0; left: 50%; transform: translateX(-50%);
          width: 80%; height: 40%;
          background: radial-gradient(ellipse at bottom, rgba(16,185,129,0.15), transparent 70%);
          pointer-events: none;
        }

        .stat-value { font-size: 36px; font-weight: 900; color: #D4AF37; margin-bottom: 8px; line-height: 1; }
        .stat-label { font-size: 14px; color: #E2E8F0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>
    </section>
  );
}
