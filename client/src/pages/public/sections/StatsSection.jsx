import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Wallet, TrendingUp, Shield } from "lucide-react";

// ===== ANIMATED COUNTER HELPER =====
function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2000, // Slightly slower for a more dramatic, premium feel
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  const display =
    count >= 1000
      ? count >= 100000
        ? `${(count / 100000).toFixed(1)}`
        : `${(count / 1000).toFixed(0)}`
      : count;

  const unit = count >= 100000 ? " Cr" : count >= 1000 ? "K" : "";

  return (
    <span ref={ref}>
      <span className="counter-prefix">{prefix}</span>
      {display}
      <span className="counter-suffix">
        {unit}
        {suffix}
      </span>
    </span>
  );
}

// ===== FADE IN HELPER =====
function FadeIn({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.8, 0.25, 1] }} // Smoother ease
    >
      {children}
    </motion.div>
  );
}

// ===== MAIN STATS COMPONENT =====
export default function StatsSection() {
  const statsData = [
    {
      icon: <Users size={26} color="#10B981" />,
      label: "Active Members",
      target: 50000,
      suffix: "+",
      glowColor: "rgba(16, 185, 129, 0.4)",
    },
    {
      icon: <Wallet size={26} color="#D4AF37" />, // Updated to premium Gold
      label: "Total Paid Out",
      prefix: "₹",
      target: 10,
      suffix: "+",
      glowColor: "rgba(212, 175, 55, 0.4)",
    },
    {
      icon: <TrendingUp size={26} color="#6366F1" />, // Updated to deep Indigo
      label: "Income Levels",
      target: 9,
      suffix: "",
      glowColor: "rgba(99, 102, 241, 0.4)",
    },
    {
      icon: <Shield size={26} color="#0EA5E9" />, // Updated to bright Cyan
      label: "System Transparency",
      target: 100,
      suffix: "%",
      glowColor: "rgba(14, 165, 233, 0.4)",
    },
  ];

  return (
    <section className="premium-stats-section">
      {/* Subtle ambient light at the top to separate from the hero section */}
      <div className="stats-ambient-light" />

      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 28,
          }}
        >
          {statsData.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.15}>
              <div className="stats-card-premium group">
                {/* Glowing Icon Container */}
                <div className="icon-container-premium">
                  <div
                    className="icon-glow"
                    style={{ background: stat.glowColor }}
                  />
                  <div className="icon-inner">{stat.icon}</div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <p className="stats-number">
                    <AnimatedCounter
                      target={stat.target}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="stats-label">{stat.label}</p>
                </div>

                {/* Hover border highlight effect */}
                <div
                  className="card-hover-border"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${stat.glowColor.replace("0.4", "0.8")}, transparent)`,
                  }}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <style>{`
        .premium-stats-section {
          background-color: #030704; /* Matches the cinematic hero */
          padding: 100px 0;
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-family: "Satoshi", "Manrope", sans-serif;
          overflow: hidden;
        }

        .stats-ambient-light {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          box-shadow: 0 0 40px 2px rgba(255,255,255,0.05);
        }

        /* Glassmorphism Card Design */
        .stats-card-premium {
          padding: 32px 28px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: default;
        }

        .stats-card-premium:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }

        /* Icon Styling */
        .icon-container-premium {
          position: relative;
          width: 56px;
          height: 56px;
        }

        .icon-inner {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .stats-card-premium:hover .icon-inner {
          transform: scale(1.05);
        }

        .icon-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          filter: blur(16px);
          opacity: 0.5;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .stats-card-premium:hover .icon-glow {
          opacity: 0.8;
        }

        /* Typography */
        .stats-number {
          font-size: 42px;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .counter-prefix, .counter-suffix {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.7em;
          font-weight: 700;
        }

        .stats-label {
          font-size: 15px;
          color: #94A3B8;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Animated Hover Border */
        .card-hover-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          opacity: 0;
          transform: translateY(2px);
          transition: all 0.3s ease;
        }

        .stats-card-premium:hover .card-hover-border {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .premium-stats-section {
            padding: 60px 0;
          }
          .stats-card-premium {
            padding: 24px;
          }
          .stats-number {
            font-size: 36px;
          }
        }
      `}</style>
    </section>
  );
}
