import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { LEVEL_DATA } from "@/constants/planData";

// Import your beautiful custom table image
import incomeTableImg from "@/assets/images/incometable.png";

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

export default function IncomeStructureSection() {
  return (
    <section className="premium-section bg-dark">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <FadeIn>
            <div className="premium-tag">
              <TrendingUp size={14} color="#D4AF37" /> Earn More at Each Level
            </div>
            <h2 className="section-heading">Income Structure</h2>
            <p className="section-subtext">
              Progress through 9 levels and unlock increasing payouts as your
              network grows.
            </p>
          </FadeIn>
        </div>

        {/* Dynamic Level Cards Grid (Kept for interactivity) */}
        <div className="level-cards-grid">
          {LEVEL_DATA.map((level, i) => (
            <FadeIn key={level.level} delay={i * 0.06}>
              <div className="glass-card premium-hover">
                <div className="badge-gold">LEVEL {level.level}</div>
                <div className="payout-amount">{level.payoutStr}</div>
                <div className="level-details">
                  <div>
                    <span>{level.members.toLocaleString("en-IN")}</span> members
                  </div>
                  <div>
                    <span>{level.sponsors}</span> sponsor
                    {level.sponsors > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Premium Graphic Table Integration */}
        <FadeIn delay={0.2}>
          <div className="premium-image-wrapper">
            {/* Ambient glow behind the image to make it pop */}
            <div className="image-glow-backdrop"></div>

            <img
              src={incomeTableImg}
              alt="Detailed Income Table"
              className="premium-table-image"
            />
          </div>
        </FadeIn>
      </div>

      <style>{`
        .bg-dark { 
          background-color: #030704; 
          padding: 100px 0; 
          border-bottom: 1px solid rgba(255,255,255,0.05); 
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 24px; 
        }
        .section-header { 
          text-align: center; 
          margin-bottom: 56px; 
        }
        .premium-tag { 
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
          text-transform: uppercase; 
          margin-bottom: 20px; 
        }
        .section-heading { 
          font-size: clamp(32px, 4vw, 48px); 
          font-weight: 900; 
          color: #FFF; 
          margin-bottom: 16px; 
        }
        .section-subtext { 
          font-size: 17px; 
          color: #94A3B8; 
          max-width: 500px; 
          margin: 0 auto; 
        }
        
        .level-cards-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
          gap: 20px; 
          margin-bottom: 64px; 
        }
        .glass-card { 
          background: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 16px; 
          backdrop-filter: blur(12px); 
          padding: 24px; 
        }
        .premium-hover { 
          transition: transform 0.3s ease, box-shadow 0.3s ease; 
        }
        .premium-hover:hover { 
          transform: translateY(-5px); 
          border-color: rgba(16,185,129,0.3); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
        }
        
        .badge-gold { 
          display: inline-block; 
          background: rgba(212, 175, 55, 0.15); 
          color: #D4AF37; 
          padding: 4px 10px; 
          border-radius: 6px; 
          font-size: 11px; 
          font-weight: 800; 
          margin-bottom: 12px; 
        }
        .payout-amount { 
          font-size: 28px; 
          font-weight: 900; 
          color: #10B981; 
          margin-bottom: 8px; 
        }
        .level-details { 
          font-size: 13px; 
          color: #94A3B8; 
        }
        .level-details span { 
          color: #FFF; 
          font-weight: 600; 
        }

        /* --- New Premium Image Styles --- */
        .premium-image-wrapper {
          position: relative;
          width: 100%;
          border-radius: 20px;
          /* The 1px gradient padding creates an ultra-premium glowing border edge */
          padding: 1px;
          background: linear-gradient(135deg, rgba(16,185,129,0.4), rgba(212,175,55,0.2), rgba(255,255,255,0.05));
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8);
          transition: transform 0.4s ease;
        }

        .premium-image-wrapper:hover {
          transform: scale(1.01);
        }

        .image-glow-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          filter: blur(50px);
          z-index: 0;
          pointer-events: none;
        }

        .premium-table-image {
          position: relative;
          width: 100%;
          height: auto;
          display: block;
          border-radius: 19px; /* Slightly less than wrapper to fit inside padding */
          z-index: 1;
          background-color: #030704; /* Prevents white flashes while loading */
        }
      `}</style>
    </section>
  );
}
