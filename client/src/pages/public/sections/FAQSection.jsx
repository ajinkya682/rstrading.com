import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_DATA } from "@/constants/planData";

function FadeIn({ children, delay = 0, y = 20 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={index * 0.06}>
      <div className="faq-glass-item">
        <button className="faq-trigger" onClick={() => setOpen(!open)}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 16,
              textAlign: "left",
              color: open ? "#10B981" : "#E2E8F0",
              transition: "color 0.3s",
            }}
          >
            {q}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} color={open ? "#10B981" : "#94A3B8"} />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "0 24px 24px",
                  color: "#94A3B8",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                {a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

export default function FAQSection() {
  return (
    <section
      id="faq"
      style={{ backgroundColor: "#030704", padding: "100px 0" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <FadeIn>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#E2E8F0",
                padding: "6px 16px",
                borderRadius: 30,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Frequently Asked
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 900,
                color: "#FFF",
                marginBottom: 16,
              }}
            >
              Common Questions
            </h2>
            <p style={{ fontSize: 17, color: "#94A3B8" }}>
              Everything you need to know about RS Trading.
            </p>
          </FadeIn>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQ_DATA.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .faq-glass-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          transition: background 0.3s, border-color 0.3s;
        }
        .faq-glass-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(16, 185, 129, 0.2);
        }
        .faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
