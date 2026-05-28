import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HOW_IT_WORKS } from "@/constants/planData";

function FadeIn({ children, delay = 0, x = 0, y = 30 }) {
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

export default function HowItWorksDetailedSection() {
  return (
    <section className="timeline-section">
      <div className="container">
        <div className="timeline-wrapper">
          {/* The glowing vertical line connecting everything */}
          <div className="timeline-track" />

          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="timeline-item">
              {/* Animated Timeline Node */}
              <FadeIn delay={i * 0.15}>
                <div className="timeline-node">
                  <div className="node-glow" />
                  <div className="node-inner">{step.step}</div>
                </div>
              </FadeIn>

              {/* Glassmorphism Content Card */}
              <FadeIn delay={i * 0.15 + 0.1} x={24}>
                <div className="glass-card premium-hover content-card">
                  <h2 className="step-title">{step.title}</h2>
                  <p className="step-desc">{step.desc}</p>

                  {/* Decorative line on hover */}
                  <div className="card-hover-border" />
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .timeline-section {
          background-color: #030704;
          padding: 100px 0 120px;
          position: relative;
        }

        .container {
          max-width: 800px; /* Kept narrow for easy readability */
          margin: 0 auto;
          padding: 0 24px;
        }

        .timeline-wrapper {
          position: relative;
          padding-left: 40px; /* Space for the track */
        }

        /* The Vertical Track Line */
        .timeline-track {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 32px; /* Center of the node */
          width: 2px;
          background: linear-gradient(180deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.3) 15%, rgba(212,175,55,0.3) 85%, rgba(212,175,55,0) 100%);
          z-index: 1;
        }

        .timeline-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 40px;
          margin-bottom: 56px;
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }

        /* Number Nodes */
        .timeline-node {
          position: absolute;
          left: -40px; /* Align precisely over track */
          top: 0;
          width: 64px;
          height: 64px;
          z-index: 2;
        }

        .node-inner {
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
          color: #FFF;
          font-family: 'Satoshi', sans-serif;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .node-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #10B981, #D4AF37);
          border-radius: 50%;
          filter: blur(12px);
          opacity: 0.3;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .timeline-item:hover .node-inner {
          border-color: #10B981;
          box-shadow: inset 0 0 20px rgba(16, 185, 129, 0.2);
        }
        .timeline-item:hover .node-glow {
          opacity: 0.7;
        }

        /* Glassmorphism Cards */
        .content-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          padding: 40px;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s ease, border-color 0.4s ease;
        }

        .premium-hover:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }

        .step-title {
          font-size: 26px;
          font-weight: 800;
          font-family: 'Satoshi', sans-serif;
          color: #FFF;
          margin-bottom: 16px;
        }

        .step-desc {
          font-size: 17px;
          color: #94A3B8;
          line-height: 1.7;
        }

        /* Animated Hover Border */
        .card-hover-border {
          position: absolute;
          bottom: 0; left: 0; width: 100%; height: 2px;
          background-image: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.8), transparent);
          opacity: 0; transform: translateY(2px); transition: all 0.3s ease;
        }
        .premium-hover:hover .card-hover-border {
          opacity: 1; transform: translateY(0);
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .timeline-wrapper {
            padding-left: 20px; /* Tighter on mobile */
          }
          .timeline-track {
            left: 12px;
          }
          .timeline-node {
            left: -20px;
            width: 48px;
            height: 48px;
          }
          .node-inner {
            font-size: 18px;
          }
          .timeline-item {
            gap: 20px;
            margin-bottom: 40px;
          }
          .content-card {
            padding: 24px;
          }
          .step-title {
            font-size: 20px;
          }
          .step-desc {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
}
