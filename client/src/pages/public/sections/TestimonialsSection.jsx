import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/constants/planData";

function FadeIn({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{
        backgroundColor: "#020402",
        padding: "100px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                color: "#D4AF37",
                padding: "6px 16px",
                borderRadius: 30,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              <Star size={14} color="#D4AF37" /> Member Stories
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 900,
                color: "#FFF",
              }}
            >
              What Our Members Say
            </h2>
          </FadeIn>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.12}>
              <div className="glass-testimonial">
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 16,
                    color: "#CBD5E1",
                    lineHeight: 1.7,
                    flex: 1,
                    fontStyle: "italic",
                    marginBottom: 24,
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    paddingTop: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #10B981, #059669)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#FFF",
                        marginBottom: 2,
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ fontSize: 13, color: "#64748B" }}>{t.city}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <style>{`
        .glass-testimonial {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          padding: 32px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.3s ease;
        }
        .glass-testimonial:hover { transform: translateY(-5px); border-color: rgba(212,175,55,0.2); }
      `}</style>
    </section>
  );
}
