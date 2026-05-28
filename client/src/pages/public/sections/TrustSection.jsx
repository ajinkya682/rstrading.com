import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Eye, Scale, Headphones } from "lucide-react";
import { TRUST_FEATURES } from "@/constants/planData";

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

export default function TrustSection() {
  return (
    <section
      style={{
        backgroundColor: "#030704",
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
              <Shield size={14} color="#D4AF37" /> Why Trust Us
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 900,
                color: "#FFF",
              }}
            >
              Built on Trust & Transparency
            </h2>
          </FadeIn>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {TRUST_FEATURES.map((feat, i) => (
            <FadeIn key={feat.title} delay={i * 0.1}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 16,
                  backdropFilter: "blur(12px)",
                  padding: 24,
                  transition: "transform 0.3s",
                }}
                className="hover-card"
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "rgba(16,185,129,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                >
                  {feat.icon === "Shield" && (
                    <Shield size={24} color="#10B981" />
                  )}
                  {feat.icon === "Eye" && <Eye size={24} color="#10B981" />}
                  {feat.icon === "Scale" && <Scale size={24} color="#D4AF37" />}
                  {feat.icon === "Headphones" && (
                    <Headphones size={24} color="#D4AF37" />
                  )}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#FFF",
                    marginBottom: 8,
                  }}
                >
                  {feat.title}
                </h3>
                <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7 }}>
                  {feat.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <style>{`.hover-card:hover { transform: translateY(-5px); border-color: rgba(212,175,55,0.3); }`}</style>
    </section>
  );
}
