import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { DISTRICTS, NOMINEE_RELATIONS, BANK_NAMES } from "@/constants/planData";

// Import your actual logo
import logo from "../../assets/images/logo.png";

const STEPS = [
  { num: 1, label: "Sponsor" },
  { num: 2, label: "Personal" },
  { num: 3, label: "Address" },
  { num: 4, label: "Banking" },
  { num: 5, label: "Review" },
];

const initialData = {
  sponsorId: "",
  sponsorName: "",
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  nomineeName: "",
  nomineeRelation: "Spouse",
  address: "",
  district: "",
  taluka: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  confirmAccount: "",
  branchName: "",
  ifscCode: "",
  panCard: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [validatingPin, setValidatingPin] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const set = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateSponsor = async (e) => {
    e.preventDefault();
    if (!data.sponsorId.trim()) {
      setErrors({ sponsorId: "Enter a sponsor ID" });
      return;
    }
    setValidatingPin(true);
    await new Promise((r) => setTimeout(r, 800));

    if (data.sponsorId.toUpperCase().startsWith("RS")) {
      setData((d) => ({ ...d, sponsorName: "Ramesh Kumar (Verified)" }));
      toast.success("Sponsor verified!", {
        style: {
          background: "#0F172A",
          color: "#FFF",
          border: "1px solid #10B981",
        },
        iconTheme: { primary: "#10B981", secondary: "#FFF" },
      });
    } else {
      setErrors({
        sponsorId: "Invalid sponsor ID. Please check and try again.",
      });
    }
    setValidatingPin(false);
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1 && !data.sponsorName)
      errs.sponsorId = "Please validate your sponsor ID first";
    if (s === 2) {
      if (!data.fullName.trim()) errs.fullName = "Full name is required";
      if (!data.mobile || data.mobile.length !== 10)
        errs.mobile = "Valid 10-digit mobile required";
      if (!data.email.includes("@")) errs.email = "Valid email required";
      if (!data.dob) errs.dob = "Date of birth required";
      if (!data.nomineeName.trim()) errs.nomineeName = "Nominee name required";
      if (!data.password || data.password.length < 8)
        errs.password = "Password must be at least 8 characters";
      if (data.password !== data.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    }
    if (s === 3) {
      if (!data.address.trim()) errs.address = "Address required";
      if (!data.district) errs.district = "District required";
    }
    if (s === 4) {
      if (!data.bankName) errs.bankName = "Bank name required";
      if (!data.accountNumber || data.accountNumber.length < 8)
        errs.accountNumber = "Valid account number required";
      if (data.accountNumber !== data.confirmAccount)
        errs.confirmAccount = "Account numbers do not match";
      if (!data.ifscCode || data.ifscCode.length !== 11)
        errs.ifscCode = "Valid 11-character IFSC required";
      if (!data.panCard || data.panCard.length !== 10)
        errs.panCard = "Valid 10-character PAN required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!data.agreeTerms) {
      toast.error("Please agree to the Terms & Conditions", {
        style: { background: "#0F172A", color: "#FFF" },
      });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const mockUser = {
      rsId: "RS" + Math.floor(1000 + Math.random() * 9000),
    };

    setSuccess(mockUser.rsId);
    setLoading(false);
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-auth-card"
            style={{ maxWidth: 480, textAlign: "center" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="premium-success-icon"
            >
              <CheckCircle size={40} color="#10B981" />
            </motion.div>

            <h2 className="auth-title">Registration Successful!</h2>
            <p className="auth-subtitle">
              Your RS Trading account has been created. Welcome to the family!
            </p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="premium-id-card"
            >
              <p className="id-label">YOUR RS TRADING ID</p>
              <p className="id-value">{success}</p>
            </motion.div>

            <p
              className="auth-subtitle"
              style={{ fontSize: 14, marginBottom: 32 }}
            >
              Note this ID — you'll need it to log in. You'll receive a
              confirmation SMS and email shortly.
            </p>

            <button
              className="btn-submit-premium"
              onClick={() => navigate("/login")}
              style={{ width: "100%" }}
            >
              Go to Login <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>
          </motion.div>
        </div>

        {/* Global Styles included at the bottom */}
      </div>
    );
  }

  // =========================================
  // REGISTRATION FORM
  // =========================================
  return (
    <div className="premium-auth-page">
      <div className="auth-glow glow-emerald" />
      <div className="auth-glow glow-gold" />

      <Link to="/" className="back-to-home">
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>

      <div className="auth-content-wrapper">
        <div className="auth-container" style={{ maxWidth: 640 }}>
          <div className="auth-header">
            <Link to="/" className="logo-wrapper">
              <img src={logo} alt="RS Trading Logo" className="auth-logo" />
            </Link>
            <p className="auth-subtitle" style={{ marginTop: 8 }}>
              Create your account — it's free
            </p>
          </div>

          <div className="progress-tracker">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="step-item">
                  <div
                    className={`step-circle ${step >= s.num ? "active" : ""}`}
                  >
                    {step > s.num ? <CheckCircle size={18} /> : s.num}
                  </div>
                  <span
                    className={`step-label ${step >= s.num ? "active" : ""}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`step-line ${step > s.num ? "active" : ""}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="glass-auth-card"
            >
              {/* STEP 1: Sponsor Info */}
              {step === 1 && (
                <div>
                  <h2 className="auth-title">Sponsor Information</h2>
                  <p className="auth-subtitle">
                    Enter your sponsor's RS Trading ID to get started.
                  </p>

                  <div className="input-group">
                    <label className="premium-label">Sponsor ID *</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <input
                        className={`premium-input ${errors.sponsorId ? "input-error" : ""}`}
                        placeholder="e.g. RS1234"
                        value={data.sponsorId}
                        onChange={(e) =>
                          set("sponsorId", e.target.value.toUpperCase())
                        }
                        style={{ flex: 1 }}
                      />
                      <button
                        className="btn-ghost-premium"
                        onClick={validateSponsor}
                        disabled={validatingPin}
                        style={{ width: "auto", padding: "0 20px" }}
                      >
                        {validatingPin ? "Validating..." : "Validate"}
                      </button>
                    </div>
                    {errors.sponsorId && (
                      <p className="error-text">
                        <AlertCircle size={14} /> {errors.sponsorId}
                      </p>
                    )}
                  </div>

                  {data.sponsorName && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="success-banner"
                    >
                      <CheckCircle size={16} color="#10B981" />
                      <span>{data.sponsorName}</span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 2: Personal Info */}
              {step === 2 && (
                <div className="premium-form">
                  <div>
                    <h2 className="auth-title">Personal Information</h2>
                    <p className="auth-subtitle">
                      Fill in your details as per your government ID.
                    </p>
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Full Name *</label>
                    <input
                      className={`premium-input ${errors.fullName ? "input-error" : ""}`}
                      placeholder="As per PAN / Aadhaar"
                      value={data.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                      <p className="error-text">
                        <AlertCircle size={14} /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">Mobile Number *</label>
                      <div className="mobile-input-wrapper">
                        <span className="mobile-prefix">+91</span>
                        <input
                          className={`premium-input mobile-input ${errors.mobile ? "input-error" : ""}`}
                          placeholder="10-digit number"
                          maxLength={10}
                          value={data.mobile}
                          onChange={(e) =>
                            set("mobile", e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                      {errors.mobile && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.mobile}
                        </p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="premium-label">Date of Birth *</label>
                      <input
                        className={`premium-input ${errors.dob ? "input-error" : ""}`}
                        type="date"
                        value={data.dob}
                        onChange={(e) => set("dob", e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {errors.dob && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.dob}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Email Address *</label>
                    <input
                      className={`premium-input ${errors.email ? "input-error" : ""}`}
                      type="email"
                      placeholder="your@email.com"
                      value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="error-text">
                        <AlertCircle size={14} /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">Nominee Name *</label>
                      <input
                        className={`premium-input ${errors.nomineeName ? "input-error" : ""}`}
                        placeholder="Nominee's full name"
                        value={data.nomineeName}
                        onChange={(e) => set("nomineeName", e.target.value)}
                      />
                      {errors.nomineeName && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.nomineeName}
                        </p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="premium-label">Nominee Relation</label>
                      <select
                        className="premium-input select"
                        value={data.nomineeRelation}
                        onChange={(e) => set("nomineeRelation", e.target.value)}
                      >
                        {NOMINEE_RELATIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">Password *</label>
                      <input
                        className={`premium-input ${errors.password ? "input-error" : ""}`}
                        type="password"
                        placeholder="Min. 8 characters"
                        value={data.password}
                        onChange={(e) => set("password", e.target.value)}
                      />
                      {errors.password && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="premium-label">
                        Confirm Password *
                      </label>
                      <input
                        className={`premium-input ${errors.confirmPassword ? "input-error" : ""}`}
                        type="password"
                        placeholder="Repeat password"
                        value={data.confirmPassword}
                        onChange={(e) => set("confirmPassword", e.target.value)}
                      />
                      {errors.confirmPassword && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Address */}
              {step === 3 && (
                <div className="premium-form">
                  <div>
                    <h2 className="auth-title">Address Details</h2>
                    <p className="auth-subtitle">
                      Your current residential address.
                    </p>
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Full Address *</label>
                    <textarea
                      className={`premium-input textarea ${errors.address ? "input-error" : ""}`}
                      rows={3}
                      placeholder="House/Flat No., Street, Area, Landmark"
                      value={data.address}
                      onChange={(e) => set("address", e.target.value)}
                    />
                    {errors.address && (
                      <p className="error-text">
                        <AlertCircle size={14} /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">District *</label>
                      <select
                        className={`premium-input select ${errors.district ? "input-error" : ""}`}
                        value={data.district}
                        onChange={(e) => set("district", e.target.value)}
                      >
                        <option value="">Select District</option>
                        {DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.district}
                        </p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="premium-label">Taluka</label>
                      <input
                        className="premium-input"
                        placeholder="Your taluka"
                        value={data.taluka}
                        onChange={(e) => set("taluka", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Banking */}
              {step === 4 && (
                <div className="premium-form">
                  <div>
                    <h2 className="auth-title">Banking Information</h2>
                    <p className="auth-subtitle">
                      Your withdrawal payouts will be sent to this bank account.
                    </p>
                  </div>

                  <div className="input-group">
                    <label className="premium-label">Bank Name *</label>
                    <select
                      className={`premium-input select ${errors.bankName ? "input-error" : ""}`}
                      value={data.bankName}
                      onChange={(e) => set("bankName", e.target.value)}
                    >
                      <option value="">Select Bank</option>
                      {BANK_NAMES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {errors.bankName && (
                      <p className="error-text">
                        <AlertCircle size={14} /> {errors.bankName}
                      </p>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">
                        Account Holder Name *
                      </label>
                      <input
                        className="premium-input"
                        placeholder="As per bank records"
                        value={data.accountHolder}
                        onChange={(e) => set("accountHolder", e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="premium-label">Branch Name</label>
                      <input
                        className="premium-input"
                        placeholder="Branch name"
                        value={data.branchName}
                        onChange={(e) => set("branchName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">Account Number *</label>
                      <input
                        className={`premium-input ${errors.accountNumber ? "input-error" : ""}`}
                        placeholder="Account number"
                        value={data.accountNumber}
                        onChange={(e) =>
                          set(
                            "accountNumber",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                      />
                      {errors.accountNumber && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.accountNumber}
                        </p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="premium-label">
                        Confirm Account Number *
                      </label>
                      <input
                        className={`premium-input ${errors.confirmAccount ? "input-error" : ""}`}
                        placeholder="Re-enter account number"
                        value={data.confirmAccount}
                        onChange={(e) =>
                          set(
                            "confirmAccount",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                      />
                      {errors.confirmAccount && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.confirmAccount}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="premium-label">IFSC Code *</label>
                      <input
                        className={`premium-input ${errors.ifscCode ? "input-error" : ""}`}
                        placeholder="11 characters"
                        maxLength={11}
                        value={data.ifscCode}
                        onChange={(e) =>
                          set("ifscCode", e.target.value.toUpperCase())
                        }
                      />
                      {errors.ifscCode && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.ifscCode}
                        </p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="premium-label">PAN Card Number *</label>
                      <input
                        className={`premium-input ${errors.panCard ? "input-error" : ""}`}
                        placeholder="10 characters"
                        maxLength={10}
                        value={data.panCard}
                        onChange={(e) =>
                          set("panCard", e.target.value.toUpperCase())
                        }
                      />
                      {errors.panCard && (
                        <p className="error-text">
                          <AlertCircle size={14} /> {errors.panCard}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Submit */}
              {step === 5 && (
                <div>
                  <h2 className="auth-title">Review & Submit</h2>
                  <p className="auth-subtitle">
                    Please review all information before submitting.
                  </p>

                  <div className="review-grid">
                    {[
                      {
                        heading: "Sponsor",
                        fields: [
                          { label: "Sponsor ID", value: data.sponsorId },
                          { label: "Sponsor Name", value: data.sponsorName },
                        ],
                      },
                      {
                        heading: "Personal",
                        fields: [
                          { label: "Full Name", value: data.fullName },
                          { label: "Mobile", value: `+91 ${data.mobile}` },
                          { label: "Email", value: data.email },
                          { label: "DOB", value: data.dob },
                        ],
                      },
                      {
                        heading: "Address",
                        fields: [
                          { label: "District", value: data.district },
                          { label: "Taluka", value: data.taluka },
                        ],
                      },
                      {
                        heading: "Banking",
                        fields: [
                          { label: "Bank", value: data.bankName },
                          {
                            label: "Account",
                            value: data.accountNumber
                              ? `****${data.accountNumber.slice(-4)}`
                              : "",
                          },
                          { label: "IFSC", value: data.ifscCode },
                          { label: "PAN", value: data.panCard },
                        ],
                      },
                    ].map((section) => (
                      <div key={section.heading} className="review-section">
                        <p className="review-heading">{section.heading}</p>
                        <div className="review-box">
                          {section.fields
                            .filter((f) => f.value)
                            .map((f) => (
                              <div key={f.label} className="review-field">
                                <span className="review-label">
                                  {f.label}:{" "}
                                </span>
                                <span className="review-value">{f.value}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="terms-row">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={data.agreeTerms}
                      onChange={(e) => set("agreeTerms", e.target.checked)}
                      className="premium-checkbox"
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="remember-label"
                      style={{ lineHeight: 1.5 }}
                    >
                      I agree to the{" "}
                      <Link
                        to="#"
                        style={{ color: "#10B981", textDecoration: "none" }}
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and confirm that all information provided is accurate.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {step > 1 ? (
                  <button
                    className="btn-ghost-premium"
                    onClick={() => setStep((s) => s - 1)}
                    style={{ width: "auto" }}
                  >
                    <ArrowLeft size={16} style={{ marginRight: 6 }} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    className="btn-submit-premium"
                    onClick={nextStep}
                    style={{ width: "auto", padding: "12px 24px", margin: 0 }}
                  >
                    Continue <ArrowRight size={16} style={{ marginLeft: 6 }} />
                  </button>
                ) : (
                  <button
                    className="btn-submit-premium"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ width: "auto", padding: "12px 24px", margin: 0 }}
                  >
                    {loading ? "Submitting..." : "Submit Registration"}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="register-prompt">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* COMPONENT STYLES */}
      <style>{`
        .premium-auth-page { min-height: 100vh; min-height: 100dvh; background-color: #030704; display: flex; flex-direction: column; position: relative; overflow-x: hidden; font-family: "Satoshi", "Manrope", sans-serif; }
        .auth-glow { position: fixed; width: 500px; height: 500px; border-radius: 50%; filter: blur(140px); opacity: 0.15; pointer-events: none; z-index: 0; }
        .glow-emerald { background: #10B981; top: -10%; right: -10%; }
        .glow-gold { background: #D4AF37; bottom: -10%; left: -10%; animation-delay: -4s; }

        .back-to-home { position: absolute; top: 32px; left: 40px; display: inline-flex; align-items: center; gap: 8px; color: #94A3B8; text-decoration: none; font-size: 15px; font-weight: 600; z-index: 10; transition: color 0.3s ease; }
        .back-to-home:hover { color: #10B981; }

        .auth-content-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 24px; width: 100%; position: relative; z-index: 1; }
        .auth-container { width: 100%; }

        .auth-header { text-align: center; margin-bottom: 32px; }
        .logo-wrapper { display: inline-block; }
        .auth-logo { height: 44px; width: auto; object-fit: contain; }

        .glass-auth-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 40px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); width: 100%; }

        .auth-title { font-size: 24px; font-weight: 900; color: #FFF; margin-bottom: 8px; letter-spacing: -0.02em; }
        .auth-subtitle { font-size: 15px; color: #94A3B8; margin-bottom: 32px; line-height: 1.6; }

        /* SUCCESS STYLES */
        .premium-success-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(16, 185, 129, 0.1); border: 2px solid rgba(16, 185, 129, 0.3);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
          animation: pulse-green 2s infinite;
        }
        
        .premium-id-card {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(16, 185, 129, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px; padding: 24px; margin-bottom: 24px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
        }
        .id-label { font-size: 12px; color: #D4AF37; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .id-value { font-size: 42px; font-weight: 900; font-family: 'Satoshi', sans-serif; color: #FFF; letter-spacing: 4px; text-shadow: 0 0 15px rgba(16,185,129,0.5); }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* Progress Tracker */
        .progress-tracker { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding: 0 10px; }
        .step-item { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94A3B8; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; transition: all 0.4s ease; }
        .step-circle.active { background: #10B981; border-color: #10B981; color: #FFF; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
        .step-label { position: absolute; top: 40px; font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; transition: color 0.4s ease; }
        .step-label.active { color: #10B981; }
        .step-line { flex: 1; height: 2px; background: rgba(255, 255, 255, 0.05); margin: 0 8px; margin-top: -16px; transition: background 0.4s ease; position: relative; z-index: 1; }
        .step-line.active { background: #10B981; }

        /* Form Elements */
        .premium-form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .premium-label { font-size: 13px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }
        .premium-input { width: 100%; padding: 14px 16px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #FFF; font-size: 15px; font-family: inherit; transition: all 0.3s ease; }
        .premium-input.select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
        .premium-input.select option { background: #0F172A; color: #FFF; }
        .premium-input::placeholder { color: #475569; }
        .premium-input:focus { outline: none; border-color: #10B981; background: rgba(0, 0, 0, 0.4); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }
        .premium-input.input-error { border-color: #EF4444; }

        .mobile-input-wrapper { display: flex; width: 100%; }
        .mobile-prefix { padding: 14px 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-right: none; border-radius: 12px 0 0 12px; color: #94A3B8; font-size: 15px; display: flex; align-items: center; }
        .mobile-input { border-radius: 0 12px 12px 0; }
        .textarea { resize: vertical; min-height: 80px; }
        .error-text { display: flex; align-items: center; gap: 6px; color: #EF4444; font-size: 12px; font-weight: 500; margin-top: 4px; }

        .success-banner { margin-top: 12px; padding: 12px 16px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; display: flex; align-items: center; gap: 10px; color: #10B981; font-weight: 600; font-size: 14px; }

        /* Review Grid */
        .review-grid { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .review-heading { font-size: 12px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .review-box { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; }
        .review-field { display: flex; flex-direction: column; gap: 4px; }
        .review-label { font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; }
        .review-value { font-size: 14px; color: #E2E8F0; font-weight: 500; }
        .terms-row { display: flex; align-items: flex-start; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.05); }

        /* Buttons & Nav */
        .form-navigation { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
        .btn-submit-premium { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #10B981, #059669); color: #FFF; padding: 14px 24px; border-radius: 12px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); width: 100%; }
        .btn-submit-premium:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4); }
        .btn-submit-premium:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-ghost-premium { display: flex; justify-content: center; align-items: center; padding: 14px 24px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: #E2E8F0; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .btn-ghost-premium:hover:not(:disabled) { background: rgba(255, 255, 255, 0.08); color: #FFF; }
        .btn-ghost-premium:disabled { opacity: 0.5; cursor: not-allowed; }

        .premium-checkbox { width: 18px; height: 18px; accent-color: #10B981; cursor: pointer; margin-top: 2px; }
        .remember-label { font-size: 14px; color: #94A3B8; cursor: pointer; user-select: none; }
        .register-prompt { text-align: center; font-size: 15px; color: #94A3B8; margin-top: 24px; }
        .register-link { color: #10B981; font-weight: 700; text-decoration: none; transition: color 0.2s ease; }
        .register-link:hover { color: #059669; }

        @media (max-width: 768px) {
          .back-to-home { top: 24px; left: 24px; }
          .auth-content-wrapper { padding: 80px 16px 40px; }
          .glass-auth-card { padding: 32px 20px; border-radius: 20px; }
          .form-row { grid-template-columns: 1fr; gap: 20px; }
          .step-label { display: none; }
          .step-circle { width: 28px; height: 28px; font-size: 12px; }
          .progress-tracker { margin-bottom: 24px; }
          .review-box { grid-template-columns: 1fr; gap: 8px; }
        }
      `}</style>
    </div>
  );
}
