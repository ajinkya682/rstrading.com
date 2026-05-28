import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

// Import your actual logo
import logo from "../../assets/images/logo.png";

export default function Login() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier.trim() || !form.password) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // Simulate API delay

    // Mock login — accepts any creds in dev mode
    if (form.password.length >= 3) {
      const mockUser = {
        rsId: "RS1001",
        fullName: "Demo User",
        email: form.identifier,
        mobile: "9876543210",
        role: "user",
        isActive: true,
        level: 3,
        walletBalance: 12200,
        totalIncome: 48500,
        sponsorId: "RS1000",
        sponsorName: "Ramesh Kumar",
        createdAt: "2024-01-15",
      };
      setAuth(mockUser, "mock_jwt_token_" + Date.now());

      toast.success(`Welcome back, ${mockUser.fullName}!`, {
        style: {
          background: "#0F172A",
          color: "#FFF",
          border: "1px solid #10B981",
        },
        iconTheme: { primary: "#10B981", secondary: "#FFF" },
      });
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Please check your ID/email and password.");
      triggerShake();
    }
    setLoading(false);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  return (
    <div className="premium-login-page">
      {/* Background ambient glows - safely positioned behind everything */}
      <div className="login-glow glow-emerald" />
      <div className="login-glow glow-gold" />

      {/* Safe Top Navigation Bar */}
      <div className="login-top-bar">
        <Link to="/" className="back-to-home">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Centered Content */}
      <div className="login-content-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`login-container ${shake ? "shake" : ""}`}
        >
          <div className="glass-login-card">
            {/* Logo & Header */}
            <div className="login-header">
              <Link to="/" className="logo-wrapper">
                <img src={logo} alt="RS Trading" className="login-logo" />
              </Link>
              <h1 className="login-title">Welcome back</h1>
              <p className="login-subtitle">
                Sign in to your RS Trading dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-box"
              >
                <AlertCircle size={18} color="#EF4444" flexShrink={0} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="input-group">
                <label className="premium-label">RS ID / Email / Mobile</label>
                <input
                  className="premium-input"
                  placeholder="RS1234, email or mobile"
                  value={form.identifier}
                  onChange={(e) =>
                    setForm({ ...form, identifier: e.target.value })
                  }
                  autoComplete="username"
                />
              </div>

              <div className="input-group">
                <div className="password-header">
                  <label className="premium-label">Password</label>
                  <Link to="/forgot-password" className="forgot-pwd-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="password-wrapper">
                  <input
                    className="premium-input"
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="pwd-toggle-btn"
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="remember-me-row">
                <input
                  type="checkbox"
                  id="remember"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                  className="premium-checkbox"
                />
                <label htmlFor="remember" className="remember-label">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="btn-submit-premium"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="30 70"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            {/* Secondary Links */}
            <Link to="/admin/login" className="btn-ghost-premium">
              Admin Login →
            </Link>

            <p className="register-prompt">
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Register free
              </Link>
            </p>
          </div>

          <p className="terms-text">
            By signing in, you agree to our Terms & Conditions and Privacy
            Policy.
          </p>
        </motion.div>
      </div>

      {/* COMPONENT STYLES */}
      <style>{`
        /* Page Layout & Background */
        .premium-login-page {
          min-height: 100vh;
          min-height: 100dvh; /* Fixes mobile browser address bar jumps */
          background-color: #030704;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
          font-family: "Satoshi", "Manrope", sans-serif;
        }

        .login-glow {
          position: fixed; /* Keeps glows in place even if screen is scrollable */
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }
        .glow-emerald { background: #10B981; top: -10%; right: -10%; }
        .glow-gold { background: #D4AF37; bottom: -10%; left: -10%; animation-delay: -4s; }

        /* Top Bar for Back Link (Safely handles mobile notches/status bars) */
        .login-top-bar {
          padding: 24px;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .back-to-home {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94A3B8;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .back-to-home:hover {
          color: #10B981;
        }

        /* Flex Wrapper to center the form safely */
        .login-content-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px 40px; /* Extra padding on bottom for mobile scrolling */
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* Container & Card */
        .login-container {
          width: 100%;
          max-width: 440px;
        }

        .glass-login-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 40px 36px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          width: 100%;
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-wrapper {
          display: inline-block;
          margin-bottom: 24px;
        }

        .login-logo {
          height: 44px;
          width: auto;
          object-fit: contain;
        }

        .login-title {
          font-size: clamp(24px, 5vw, 28px);
          font-weight: 900;
          color: #FFF;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 15px;
          color: #94A3B8;
        }

        /* Error Box */
        .error-box {
          padding: 14px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
          color: #FCA5A5;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }

        /* Form Elements */
        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .premium-label {
          font-size: 13px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .forgot-pwd-link {
          font-size: 13px;
          color: #10B981;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .forgot-pwd-link:hover { color: #059669; }

        .password-wrapper {
          position: relative;
          display: flex;
          width: 100%;
        }

        .premium-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #FFF;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.3s ease;
        }
        
        .password-wrapper .premium-input {
          padding-right: 48px; /* Safe space for the eye icon */
        }
        
        .premium-input::placeholder { color: #475569; }
        .premium-input:focus {
          outline: none;
          border-color: #10B981;
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
        }

        .pwd-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }
        .pwd-toggle-btn:hover { color: #94A3B8; }

        .remember-me-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: -4px;
        }

        .premium-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #10B981;
          cursor: pointer;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .remember-label {
          font-size: 14px;
          color: #94A3B8;
          cursor: pointer;
          user-select: none;
        }

        /* Buttons */
        .btn-submit-premium {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #10B981, #059669);
          color: #FFF;
          padding: 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
          width: 100%;
        }
        .btn-submit-premium:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4);
        }
        .btn-submit-premium:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .loading-spinner svg {
          animation: spin 1s linear infinite;
        }

        /* Dividers & Links */
        .divider-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255, 255, 255, 0.1); }
        .divider-text { font-size: 13px; color: #64748B; font-weight: 600; text-transform: uppercase; }

        .btn-ghost-premium {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E2E8F0;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .btn-ghost-premium:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFF;
        }

        .register-prompt {
          text-align: center;
          font-size: 15px;
          color: #94A3B8;
          margin-top: 24px;
        }
        .register-link {
          color: #10B981;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .register-link:hover { color: #059669; }

        /* Footer text */
        .terms-text {
          text-align: center;
          font-size: 13px;
          color: #64748B;
          margin-top: 24px;
          padding: 0 20px;
        }

        /* Animations */
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }

        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        /* =========================================
           BULLETPROOF MOBILE RESPONSIVENESS
           ========================================= */
        @media (max-width: 480px) {
          .login-top-bar {
            padding: 16px 20px;
          }
          
          .login-content-wrapper {
            padding: 0 16px 32px;
          }

          .glass-login-card {
            padding: 32px 24px;
            border-radius: 20px;
          }

          .login-logo {
            height: 36px;
          }

          .premium-input {
            padding: 12px 14px;
            font-size: 15px;
          }

          .btn-submit-premium {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}
