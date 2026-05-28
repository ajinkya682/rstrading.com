import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="premium-cta">
      <div className="cta-overlay" />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="cta-content"
      >
        <h2 className="cta-heading">Ready to Start Your Journey?</h2>
        <p className="cta-subtext">
          Join 50,000+ members who are already building their financial future
          with the RS Trading platform.
        </p>
        <Link to="/register" className="btn-gold-glow">
          Join RS Trading Today <ArrowRight size={18} />
        </Link>
      </motion.div>

      <style>{`
        .premium-cta {
          position: relative;
          background: #030704;
          padding: 120px 24px;
          text-align: center;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .cta-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(16,185,129,0.15) 0%, rgba(3,7,4,1) 70%);
          z-index: 1;
        }
        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          margin: 0 auto;
        }
        .cta-heading { font-size: clamp(32px, 5vw, 56px); font-weight: 900; color: #FFF; margin-bottom: 20px; letter-spacing: -0.02em; }
        .cta-subtext { font-size: 18px; color: #94A3B8; margin-bottom: 40px; line-height: 1.6; }
        
        .btn-gold-glow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #D4AF37, #B4942A);
          color: #030704;
          padding: 18px 36px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 18px;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }
        .btn-gold-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5); }
      `}</style>
    </section>
  );
}
