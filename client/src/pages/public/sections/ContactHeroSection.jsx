import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare } from "lucide-react";

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

export default function ContactHeroSection() {
  return (
    <section className="contact-hero">
      {/* Cinematic Background Glows */}
      <div className="hero-glow glow-emerald" />
      <div className="hero-glow glow-gold" />
      <div className="hero-overlay" />

      <div className="container">
        <FadeIn>
          <div className="premium-tag-center">
            <MessageSquare size={14} color="#D4AF37" /> Get In Touch
          </div>
          <h1 className="hero-heading">
            Contact <span className="text-gradient">RS Trading</span>
          </h1>
          <p className="hero-subtext">
            Have questions about our network, need assistance with your
            dashboard, or want to partner with us? Our premium support team is
            here to help.
          </p>
        </FadeIn>
      </div>

      <style>{`
        .contact-hero {
          position: relative;
          background-color: #030704;
          padding: 180px 24px 80px; /* Top padding clears the navbar */
          text-align: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }

        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }
        .glow-emerald { background: #10B981; top: -200px; right: -100px; }
        .glow-gold { background: #D4AF37; bottom: -200px; left: -100px; }
        
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, #030704 80%);
          z-index: 1;
        }

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
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-heading {
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 900;
          color: #FFF;
          margin: 0 auto 20px;
          max-width: 800px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .text-gradient {
          background: linear-gradient(to right, #10B981, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 18px;
          color: #94A3B8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }
        
        /* Mobile padding adjustment */
        @media (max-width: 968px) {
          .contact-hero { padding-top: 140px; }
        }
      `}</style>
    </section>
  );
}
