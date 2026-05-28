import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

// Import your actual logo
import logo from "../../assets/images/logo.png";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes("@") && email.length < 10) {
      toast.error("Enter valid email or mobile", {
        style: { background: "#0F172A", color: "#FFF" },
      });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("OTP sent to your email/mobile", {
      style: {
        background: "#0F172A",
        color: "#FFF",
        border: "1px solid #10B981",
      },
      iconTheme: { primary: "#10B981", secondary: "#FFF" },
    });
    setStep(2);
    setLoading(false);
  };

  const handleOTPInput = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter all 6 digits", {
        style: { background: "#0F172A", color: "#FFF" },
      });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("OTP verified!", {
      style: {
        background: "#0F172A",
        color: "#FFF",
        border: "1px solid #10B981",
      },
      iconTheme: { primary: "#10B981", secondary: "#FFF" },
    });
    setStep(3);
    setLoading(false);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters", {
        style: { background: "#0F172A", color: "#FFF" },
      });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match", {
        style: { background: "#0F172A", color: "#FFF" },
      });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
    setLoading(false);

    // The loading bar takes exactly 2 seconds
    setTimeout(() => navigate("/login"), 2000);
  };

  // =========================================
  // PREMIUM SUCCESS SCREEN
  // =========================================
  if (success) {
    return (
      <div className="premium-auth-page">
        <div className="auth-glow glow-emerald" />
        <div className="auth-glow glow-gold" />
        <div className="auth-content-wrapper">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-auth-card"
            style={{ maxWidth: 380, textAlign: "center" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="premium-success-icon"
            >
              <CheckCircle size={40} color="#10B981" />
            </motion.div>

            <h2 className="auth-title">Password Reset!</h2>
            <p className="auth-subtitle">
              Your password has been successfully updated.
            </p>

            <p
              className="auth-subtitle"
              style={{ fontSize: 13, marginBottom: 16 }}
            >
              Redirecting to login securely...
            </p>

            {/* Animated Redirect Loading Bar */}
            <div className="redirect-loader">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="redirect-loader-bar"
              />
            </div>
          </motion.div>
        </div>

        {/* Make sure CSS is still rendered */}
        <style>{`
          .premium-auth-page { min-height: 100vh; min-height: 100dvh; background-color: #030704; display: flex; flex-direction: column; position: relative; overflow-x: hidden; font-family: "Satoshi", "Manrope", sans-serif; }
          .auth-glow { position: fixed; width: 500px; height: 500px; border-radius: 50%; filter: blur(140px); opacity: 0.15; pointer-events: none; z-index: 0; }
          .glow-emerald { background: #10B981; top: -10%; right: -10%; }
          .glow-gold { background: #D4AF37; bottom: -10%; left: -10%; animation-delay: -4s; }
          .auth-content-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; width: 100%; position: relative; z-index: 1; }
          .glass-auth-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 40px 36px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); width: 100%; }
          .auth-title { font-size: 24px; font-weight: 900; color: #FFF; margin-bottom: 8px; letter-spacing: -0.02em; }
          .auth-subtitle { font-size: 15px; color: #94A3B8; margin-bottom: 24px; line-height: 1.6; }
          
          .premium-success-icon { width: 80px; height: 80px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); border: 2px solid rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); animation: pulse-green 2s infinite; }
          @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
          
          .redirect-loader { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
          .redirect-loader-bar { height: 100%; background: linear-gradient(90deg, #10B981, #D4AF37); border-radius: 2px; }
        `}</style>
      </div>
    );
  }

  // =========================================
  // RESET PROCESS FORM
  // =========================================
  return (
    <div className="premium-auth-page">
      <div className="auth-glow glow-emerald" />
      <div className="auth-glow glow-gold" />

      <div className="auth-content-wrapper">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="logo-wrapper">
              <img src={logo} alt="RS Trading" className="auth-logo" />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass-auth-card"
            >
              {/* STEP 1: Request OTP */}
              {step === 1 && (
                <>
                  <h2 className="auth-title">Forgot Password?</h2>
                  <p className="auth-subtitle">
                    Enter your registered email or mobile number and we'll send
                    you an OTP.
                  </p>
                  <form onSubmit={sendOTP} className="premium-form">
                    <div className="input-group">
                      <label className="premium-label">
                        Email / Mobile Number
                      </label>
                      <input
                        className="premium-input"
                        placeholder="email or 10-digit mobile"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-submit-premium"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </form>
                </>
              )}

              {/* STEP 2: Verify OTP */}
              {step === 2 && (
                <>
                  <h2 className="auth-title">Enter OTP</h2>
                  <p className="auth-subtitle">
                    We sent a secure 6-digit code to{" "}
                    <strong style={{ color: "#FFF" }}>{email}</strong>
                  </p>
                  <form onSubmit={verifyOTP} className="premium-form">
                    <div className="otp-container">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOTPInput(i, e.target.value.replace(/\D/g, ""))
                          }
                          onKeyDown={(e) => handleOTPKeyDown(i, e)}
                          className={`otp-input ${digit ? "filled" : ""}`}
                        />
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="btn-submit-premium"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <p className="resend-prompt">
                      Didn't receive it?{" "}
                      <button
                        type="button"
                        onClick={() =>
                          toast.success("OTP resent!", {
                            style: { background: "#0F172A", color: "#FFF" },
                          })
                        }
                        className="resend-btn"
                      >
                        Resend OTP
                      </button>
                    </p>
                  </form>
                </>
              )}

              {/* STEP 3: Reset Password */}
              {step === 3 && (
                <>
                  <h2 className="auth-title">Reset Password</h2>
                  <p className="auth-subtitle">
                    Create a new strong password for your account.
                  </p>
                  <form onSubmit={resetPassword} className="premium-form">
                    <div className="input-group">
                      <label className="premium-label">New Password</label>
                      <input
                        className="premium-input"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label className="premium-label">
                        Confirm New Password
                      </label>
                      <input
                        className="premium-input"
                        type="password"
                        placeholder="Repeat new password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                        required
                      />
                      {passwords.confirm &&
                        passwords.new !== passwords.confirm && (
                          <p className="error-text">Passwords do not match</p>
                        )}
                    </div>
                    <button
                      type="submit"
                      className="btn-submit-premium"
                      disabled={loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                </>
              )}

              {/* Back to Login Footer */}
              <div className="auth-footer">
                <Link to="/login" className="back-link">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .premium-auth-page { min-height: 100vh; min-height: 100dvh; background-color: #030704; display: flex; flex-direction: column; position: relative; overflow-x: hidden; font-family: "Satoshi", "Manrope", sans-serif; }
        .auth-glow { position: fixed; width: 500px; height: 500px; border-radius: 50%; filter: blur(140px); opacity: 0.15; pointer-events: none; z-index: 0; }
        .glow-emerald { background: #10B981; top: -10%; right: -10%; }
        .glow-gold { background: #D4AF37; bottom: -10%; left: -10%; animation-delay: -4s; }

        .auth-content-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; width: 100%; position: relative; z-index: 1; }
        .auth-container { width: 100%; max-width: 440px; }

        .auth-header { text-align: center; margin-bottom: 24px; }
        .logo-wrapper { display: inline-block; }
        .auth-logo { height: 44px; width: auto; object-fit: contain; }

        .glass-auth-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 40px 36px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); width: 100%; }

        .auth-title { font-size: 24px; font-weight: 900; color: #FFF; margin-bottom: 8px; letter-spacing: -0.02em; }
        .auth-subtitle { font-size: 15px; color: #94A3B8; margin-bottom: 24px; line-height: 1.6; }

        .premium-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .premium-label { font-size: 13px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }
        .premium-input { width: 100%; padding: 14px 16px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #FFF; font-size: 16px; font-family: inherit; transition: all 0.3s ease; }
        .premium-input::placeholder { color: #475569; }
        .premium-input:focus { outline: none; border-color: #10B981; background: rgba(0, 0, 0, 0.4); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }
        .error-text { color: #EF4444; font-size: 13px; margin-top: 4px; font-weight: 500; }

        .otp-container { display: flex; gap: 10px; justify-content: center; }
        .otp-input { width: 52px; height: 60px; text-align: center; font-size: 24px; font-weight: 800; font-family: 'Satoshi', sans-serif; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; background: rgba(0, 0, 0, 0.2); color: #FFF; outline: none; transition: all 0.2s ease; }
        .otp-input:focus { border-color: #10B981; background: rgba(0, 0, 0, 0.4); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }
        .otp-input.filled { border-color: #10B981; background: rgba(16, 185, 129, 0.05); }

        .resend-prompt { text-align: center; font-size: 14px; color: #64748B; }
        .resend-btn { background: none; border: none; color: #10B981; font-weight: 600; cursor: pointer; font-size: 14px; padding: 0; transition: color 0.2s ease; }
        .resend-btn:hover { color: #059669; }

        .btn-submit-premium { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #10B981, #059669); color: #FFF; padding: 16px; border-radius: 12px; font-weight: 800; font-size: 16px; border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); width: 100%; }
        .btn-submit-premium:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4); }
        .btn-submit-premium:disabled { opacity: 0.7; cursor: not-allowed; }

        .auth-footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: center; }
        .back-link { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #94A3B8; text-decoration: none; transition: color 0.3s ease; }
        .back-link:hover { color: #FFF; }

        @media (max-width: 480px) {
          .auth-content-wrapper { padding: 24px 16px; }
          .glass-auth-card { padding: 32px 20px; border-radius: 20px; }
          .auth-logo { height: 36px; }
          .otp-input { width: 44px; height: 52px; font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
