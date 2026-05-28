import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Users, Award, ShieldCheck } from "lucide-react";

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

export default function AboutValuesSection() {
  // Adapted colors to fit the luxury dark theme
  const values = [
    {
      icon: <Target size={24} color="#10B981" />,
      title: "Transparency",
      desc: "Every transaction, every payout, every team join — visible to you in real time.",
      glow: "rgba(16, 185, 129, 0.4)",
    },
    {
      icon: <Users size={24} color="#3B82F6" />,
      title: "Community",
      desc: "We believe in collective growth. When your team wins, you win.",
      glow: "rgba(59, 130, 246, 0.4)",
    },
    {
      icon: <Award size={24} color="#D4AF37" />,
      title: "Excellence",
      desc: "Premium platform experience, reliable payouts, and responsive support.",
      glow: "rgba(212, 175, 55, 0.4)",
    },
    {
      icon: <ShieldCheck size={24} color="#EC4899" />,
      title: "Integrity",
      desc: "Legal, ethical, and transparent business operations — always.",
      glow: "rgba(236, 72, 153, 0.4)",
    },
  ];

  return (
    <section className="values-section">
      <div className="container">
        <div className="section-header">
          <FadeIn>
            <h2 className="section-heading">Our Core Values</h2>
          </FadeIn>
        </div>

        <div className="values-grid">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div className="glass-card premium-hover">
                {/* Glowing Icon Container (matches StatsSection) */}
                <div className="icon-container-premium">
                  <div className="icon-glow" style={{ background: v.glow }} />
                  <div className="icon-inner">{v.icon}</div>
                </div>

                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>

                <div
                  className="card-hover-border"
                  style={{
                    backgroundImage: `linear-gradient(to right, transparent, ${v.glow.replace("0.4", "0.8")}, transparent)`,
                  }}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <style>{`
        .values-section { padding: 100px 0; background-color: #030704; border-top: 1px solid rgba(255,255,255,0.05); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-header { text-align: center; margin-bottom: 56px; }
        .section-heading { font-size: clamp(32px, 4vw, 40px); font-weight: 900; color: #FFF; }

        .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        
        .glass-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          padding: 32px 24px;
          overflow: hidden;
          transition: transform 0.4s ease, background 0.4s ease;
        }
        .premium-hover:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.04);
        }

        /* Icon Styling */
        .icon-container-premium { position: relative; width: 56px; height: 56px; margin-bottom: 20px; }
        .icon-inner {
          position: absolute; inset: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          z-index: 2; transition: transform 0.3s ease;
        }
        .premium-hover:hover .icon-inner { transform: scale(1.05); }
        .icon-glow {
          position: absolute; inset: 0; border-radius: 50%;
          filter: blur(16px); opacity: 0.5; z-index: 1; transition: opacity 0.3s ease;
        }
        .premium-hover:hover .icon-glow { opacity: 0.8; }

        .value-title { font-size: 18px; font-weight: 800; color: #FFF; margin-bottom: 12px; }
        .value-desc { font-size: 15px; color: #94A3B8; line-height: 1.7; }

        /* Animated Hover Border */
        .card-hover-border {
          position: absolute; bottom: 0; left: 0; width: 100%; height: 2px;
          opacity: 0; transform: translateY(2px); transition: all 0.3s ease;
        }
        .premium-hover:hover .card-hover-border { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  );
}
