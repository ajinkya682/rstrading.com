import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LEVEL_DATA } from "@/constants/planData";
import { formatCurrency } from "@/utils/formatCurrency";

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

export default function EarningsCalculatorSection() {
  const [members, setMembers] = useState(100);

  const calcData = LEVEL_DATA.map((level) => ({
    level: `L${level.level}`,
    earned:
      members >= level.members
        ? level.payout
        : Math.round(level.payout * (members / level.members) * 0.3),
    qualified: members >= level.members,
    payout: level.payout,
  }));

  const totalEarned = calcData
    .filter((d) => d.qualified)
    .reduce((s, d) => s + d.payout, 0);

  return (
    <section className="bg-darker">
      <div className="container">
        <div className="section-header">
          <FadeIn>
            <div className="premium-tag">
              <BarChart2 size={14} color="#D4AF37" /> Earnings Calculator
            </div>
            <h2 className="section-heading">See Your Income Potential</h2>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="glass-card control-panel">
            <div className="flex-between">
              <label className="text-light">Number of Team Members</label>
              <span className="highlight-number">
                {members.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15000}
              value={members}
              onChange={(e) => setMembers(Number(e.target.value))}
              className="premium-slider"
            />
          </div>
        </FadeIn>

        <div className="chart-grid">
          <FadeIn delay={0.15}>
            <div className="glass-card chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calcData} barSize={28}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="level"
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 100000 ? `₹${v / 100000}L` : `₹${v / 1000}K`
                    }
                  />
                  <Tooltip
                    formatter={(v, n, p) => [
                      formatCurrency(
                        p.payload.qualified ? p.payload.payout : v,
                      ),
                      "Income",
                    ]}
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                    cursor={{ fill: "rgba(16,185,129,0.1)" }}
                  />
                  <Bar dataKey="earned" radius={[6, 6, 0, 0]} fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="stats-column">
              <div className="glass-card gold-gradient">
                <p className="sub-label">TOTAL INCOME UNLOCKED</p>
                <p className="total-amount">{formatCurrency(totalEarned)}</p>
              </div>
              <div className="glass-card">
                <p className="sub-label">LEVELS QUALIFIED</p>
                <div className="levels-flex">
                  {calcData.map((d, i) => (
                    <div
                      key={i}
                      className={`level-box ${d.qualified ? "qualified" : "locked"}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        .bg-darker { background-color: #020402; padding: 100px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-header { text-align: center; margin-bottom: 56px; }
        .premium-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); color: #D4AF37; padding: 6px 16px; border-radius: 30px; font-size: 13px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
        .section-heading { font-size: clamp(32px, 4vw, 48px); font-weight: 900; color: #FFF; margin-bottom: 16px; }
        
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; backdrop-filter: blur(12px); padding: 24px; }
        .control-panel { margin-bottom: 32px; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .text-light { color: #E2E8F0; font-weight: 600; font-size: 15px; }
        .highlight-number { font-size: 28px; font-weight: 800; color: #10B981; }
        
        .premium-slider { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; outline: none; -webkit-appearance: none; accent-color: #10B981; }
        .premium-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: #10B981; border-radius: 50%; cursor: pointer; box-shadow: 0 0 15px rgba(16,185,129,0.5); }
        
        .chart-grid { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: start; }
        .stats-column { display: flex; flex-direction: column; gap: 16px; }
        
        .gold-gradient { background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(16,185,129,0.15)); border-color: rgba(212,175,55,0.3); text-align: center; }
        .sub-label { font-size: 12px; color: #94A3B8; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; }
        .total-amount { font-size: 32px; font-weight: 900; color: #FFF; }
        
        .levels-flex { display: flex; gap: 8px; flex-wrap: wrap; }
        .level-box { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; transition: all 0.3s; }
        .qualified { background: #10B981; color: #FFF; box-shadow: 0 0 10px rgba(16,185,129,0.3); }
        .locked { background: rgba(255,255,255,0.05); color: #64748B; }

        @media (max-width: 968px) { .chart-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
