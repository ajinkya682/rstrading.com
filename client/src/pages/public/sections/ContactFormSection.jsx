import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

function FadeIn({ children, delay = 0, x = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.", {
      style: {
        background: "#0F172A",
        color: "#FFF",
        border: "1px solid #10B981",
      },
      iconTheme: { primary: "#10B981", secondary: "#FFF" },
    });
    setForm({ name: "", email: "", mobile: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: <Mail size={22} color="#10B981" />,
      label: "Email Address",
      value: "support@rstradingonline.co.in",
      glow: "rgba(16, 185, 129, 0.4)",
    },
    {
      icon: <Phone size={22} color="#D4AF37" />,
      label: "Phone Number",
      value: "+91 98765 43210",
      glow: "rgba(212, 175, 55, 0.4)",
    },
    {
      icon: <MapPin size={22} color="#3B82F6" />,
      label: "Office Location",
      value: "Maharashtra, India",
      glow: "rgba(59, 130, 246, 0.4)",
    },
  ];

  return (
    <section className="contact-grid-section">
      <div className="container">
        <div className="contact-layout">
          {/* Left Column: Contact Info */}
          <FadeIn x={-30}>
            <div className="info-column">
              <h2 className="column-heading">Contact Information</h2>
              <p className="column-subtext">
                Reach out to us directly through any of the channels below.
              </p>

              <div className="info-list">
                {contactInfo.map((c) => (
                  <div key={c.label} className="info-item premium-hover">
                    {/* Glowing Icon Container */}
                    <div className="icon-container-premium">
                      <div
                        className="icon-glow"
                        style={{ background: c.glow }}
                      />
                      <div className="icon-inner">{c.icon}</div>
                    </div>
                    <div>
                      <p className="info-label">{c.label}</p>
                      <p className="info-value">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Glassmorphic Business Hours Card */}
              <div className="business-hours-card">
                <div className="hours-glow" />
                <p className="hours-title">Business Hours</p>
                <p className="hours-text">
                  Monday – Saturday: 9:00 AM – 6:00 PM IST
                </p>
                <p className="hours-text">Response time: within 24 hours</p>
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Premium Form */}
          <FadeIn x={30} delay={0.1}>
            <div className="glass-form-card">
              <h3 className="form-heading">Send us a Message</h3>

              <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-row">
                  <div className="input-group">
                    <label className="premium-label">Full Name</label>
                    <input
                      className="premium-input"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="premium-label">Mobile</label>
                    <input
                      className="premium-input"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="premium-label">Email Address</label>
                  <input
                    className="premium-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="premium-label">Message</label>
                  <textarea
                    className="premium-input textarea"
                    rows={5}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit-premium"
                  disabled={loading}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        .contact-grid-section { padding: 100px 0 120px; background-color: #030704; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        
        .contact-layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: 64px; align-items: start; }

        /* Left Column */
        .column-heading { font-size: 28px; font-weight: 800; color: #FFF; margin-bottom: 8px; }
        .column-subtext { font-size: 16px; color: #94A3B8; margin-bottom: 40px; }

        .info-list { display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; }
        .info-item { display: flex; gap: 20px; align-items: center; padding: 12px; border-radius: 16px; transition: background 0.3s ease; }
        .info-item:hover { background: rgba(255,255,255,0.02); }

        /* Icons */
        .icon-container-premium { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
        .icon-inner {
          position: absolute; inset: 0; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px; display: flex; align-items: center; justify-content: center; z-index: 2; transition: transform 0.3s ease;
        }
        .premium-hover:hover .icon-inner { transform: scale(1.05); }
        .icon-glow {
          position: absolute; inset: 0; border-radius: 50%; filter: blur(14px); opacity: 0.4; z-index: 1; transition: opacity 0.3s ease;
        }
        .premium-hover:hover .icon-glow { opacity: 0.8; }

        .info-label { font-size: 13px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .info-value { font-size: 16px; color: #FFF; font-weight: 600; }

        /* Business Hours Card */
        .business-hours-card {
          position: relative; padding: 24px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px; backdrop-filter: blur(12px); overflow: hidden;
        }
        .hours-glow {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(16,185,129,0.05), transparent 60%); pointer-events: none;
        }
        .hours-title { font-size: 14px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; position: relative; z-index: 2;}
        .hours-text { font-size: 15px; color: #CBD5E1; margin-bottom: 6px; position: relative; z-index: 2;}
        .hours-text:last-child { margin-bottom: 0; color: #94A3B8; font-size: 14px; }

        /* Right Column (Form) */
        .glass-form-card {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px; padding: 40px; backdrop-filter: blur(16px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        
        .form-heading { font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 32px; }
        
        .premium-form { display: flex; flex-direction: column; gap: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        
        .premium-label { font-size: 13px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .premium-input {
          width: 100%; padding: 14px 16px; background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
          color: #FFF; font-size: 16px; font-family: inherit; transition: all 0.3s ease;
        }
        .premium-input::placeholder { color: #475569; }
        .premium-input:focus {
          outline: none; border-color: #10B981; background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
        }
        
        .textarea { resize: vertical; min-height: 120px; }

        .btn-submit-premium {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: linear-gradient(135deg, #10B981, #059669); color: #FFF;
          padding: 16px; border-radius: 12px; font-weight: 800; font-size: 16px;
          border: none; cursor: pointer; transition: all 0.3s ease; margin-top: 8px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }
        .btn-submit-premium:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }
        .btn-submit-premium:disabled {
          opacity: 0.7; cursor: not-allowed;
        }

        /* Mobile Layout */
        @media (max-width: 968px) {
          .contact-layout { grid-template-columns: 1fr; gap: 48px; }
          .form-row { grid-template-columns: 1fr; gap: 24px; }
          .glass-form-card { padding: 32px 24px; }
        }
      `}</style>
    </section>
  );
}
