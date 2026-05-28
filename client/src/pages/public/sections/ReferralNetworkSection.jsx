import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, CheckCircle } from "lucide-react";

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

export default function ReferralNetworkSection() {
  return (
    <section
      style={{
        backgroundColor: "#030704",
        padding: "100px 0",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 64,
            alignItems: "center",
          }}
        >
          <FadeIn>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  color: "#10B981",
                  padding: "6px 16px",
                  borderRadius: 30,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                <Zap size={14} color="#10B981" /> Network Effect
              </div>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 900,
                  color: "#FFF",
                  marginBottom: 24,
                  lineHeight: 1.1,
                }}
              >
                One Referral Becomes
                <br />
                <span style={{ color: "#10B981" }}>Thousands of Incomes</span>
              </h2>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: 17,
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                The RS Trading network multiplies your reach. Every person you
                refer brings their own network, creating a cascading effect of
                income across all 9 levels.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  {
                    label: "Direct income from your referrals",
                    color: "#10B981",
                  },
                  {
                    label: "Level income from their networks",
                    color: "#D4AF37",
                  },
                  { label: "Income from 9 levels deep", color: "#6366F1" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <CheckCircle size={20} color={item.color} />
                    <span
                      style={{
                        fontSize: 16,
                        color: "#E2E8F0",
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 400 340"
                style={{
                  width: "100%",
                  maxWidth: 400,
                  filter: "drop-shadow(0 0 20px rgba(16,185,129,0.1))",
                }}
              >
                {/* You - Center top */}
                <motion.circle
                  cx="200"
                  cy="50"
                  r="28"
                  fill="#10B981"
                  animate={{
                    r: [28, 32, 28],
                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <text
                  x="200"
                  y="55"
                  textAnchor="middle"
                  fill="#030704"
                  fontSize="12"
                  fontWeight="bold"
                >
                  YOU
                </text>

                {/* Level 1 Connections */}
                {[80, 160, 240, 320].map((cx, i) => (
                  <g key={i}>
                    <line
                      x1="200"
                      y1="78"
                      x2={cx}
                      y2="152"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                    />
                    <motion.line
                      x1="200"
                      y1="78"
                      x2={cx}
                      y2="152"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                    <motion.circle
                      cx={cx}
                      cy="165"
                      r="22"
                      fill="#1E3A5F"
                      border="1px solid #333"
                      animate={{ r: [22, 24, 22] }}
                      transition={{
                        duration: 2.5,
                        delay: i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <text
                      x={cx}
                      y="170"
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="700"
                    >
                      L1
                    </text>
                  </g>
                ))}

                {/* Level 2 Sub-connections */}
                {[60, 140, 220, 300].map((cx, i) => (
                  <g key={i}>
                    <line
                      x1={[80, 160, 240, 320][Math.floor(i)]}
                      y1="187"
                      x2={cx}
                      y2="265"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                    />
                    <motion.circle
                      cx={cx}
                      cy="276"
                      r="16"
                      fill="#D4AF37"
                      opacity={0.9}
                      animate={{ r: [16, 18, 16] }}
                      transition={{
                        duration: 2.5,
                        delay: i * 0.3,
                        repeat: Infinity,
                      }}
                    />
                    <text
                      x={cx}
                      y="281"
                      textAnchor="middle"
                      fill="#030704"
                      fontSize="9"
                      fontWeight="800"
                    >
                      L2
                    </text>
                  </g>
                ))}

                {/* Bottom Glow Banner */}
                <rect
                  x="10"
                  y="300"
                  width="380"
                  height="36"
                  rx="8"
                  fill="rgba(16,185,129,0.1)"
                  stroke="rgba(16,185,129,0.2)"
                  strokeWidth="1"
                />
                <text
                  x="200"
                  y="323"
                  textAnchor="middle"
                  fill="#10B981"
                  fontSize="12"
                  fontWeight="700"
                >
                  Income flows up through every level automatically
                </text>
              </svg>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
