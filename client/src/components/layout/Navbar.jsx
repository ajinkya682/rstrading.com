import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// Adjust path if needed
import logo from "../../assets/images/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Business Plan", to: "/business-plan" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Handle scroll effect for desktop glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when a link is clicked (route changes)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  return (
    <>
      <nav className={`premium-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo - Protected from squishing */}
          <Link to="/" className="nav-logo">
            <img src={logo} alt="RS Trading Logo" className="logo-img" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="active-indicator"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="desktop-nav-actions">
            {isAuthenticated ? (
              <button
                className="btn-premium-dashboard"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-nav-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-nav-glow">
                  Register Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={28} color="#FFF" />
            ) : (
              <Menu size={28} color="#FFF" />
            )}
          </button>
        </div>
      </nav>

      {/* Premium Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mobile-menu-overlay"
          >
            <div className="mobile-menu-content">
              {navLinks.map((link) => {
                const isActive = pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`mobile-link ${isActive ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mobile-actions-divider" />

              <div className="mobile-actions">
                {isAuthenticated ? (
                  <button
                    className="btn-premium-dashboard w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-nav-outline w-full text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-nav-glow w-full text-center"
                    >
                      Register Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Core Navbar Styles */
        .premium-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999; /* Extremely high to stay above all hero content */
          padding: 24px 0;
          background: transparent;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "Satoshi", "Manrope", sans-serif;
        }

        /* Glassmorphism Scroll State (Desktop) */
        .premium-navbar.scrolled {
          padding: 14px 0;
          background: rgba(3, 7, 4, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-container {
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo Sizing Fixes */
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0; /* Prevents the logo from getting squished */
        }
        
        .logo-img {
          max-height: 44px;
          width: auto;
          object-fit: contain;
          transition: max-height 0.3s ease;
        }

        .premium-navbar.scrolled .logo-img {
          max-height: 36px;
        }

        /* Desktop Navigation Links */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          position: relative;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          color: #94A3B8;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #FFF;
        }

        .nav-link.active {
          color: #FFF;
        }

        .active-indicator {
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 2px;
          background: #10B981;
          border-radius: 2px;
          box-shadow: 0 -2px 10px rgba(16, 185, 129, 0.5);
        }

        /* Buttons */
        .desktop-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-nav-outline {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          color: #FFF;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .btn-nav-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #FFF;
        }

        .btn-nav-glow {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          color: #030704;
          background: linear-gradient(135deg, #10B981, #059669);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }

        .btn-nav-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
        }

        .btn-premium-dashboard {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          color: #030704;
          background: linear-gradient(135deg, #D4AF37, #B4942A);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }

        .btn-premium-dashboard:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
        }

        /* Mobile Hamburger Toggle */
        .mobile-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 10001;
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 7, 4, 0.98); 
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 9998;
          padding: 100px 24px 24px; 
          overflow-y: auto;
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-link {
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          color: #94A3B8;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-link.active {
          color: #10B981;
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .mobile-actions-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 16px 0;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .w-full {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 16px !important;
          font-size: 16px !important;
        }

        /* =========================================
           CRITICAL MOBILE RESPONSIVE FIXES
           ========================================= */
        @media (max-width: 968px) {
          .desktop-nav, .desktop-nav-actions {
            display: none !important;
          }
          
          .mobile-hamburger {
            display: flex !important;
            align-items: center;
          }
          
          /* INCREASED LOGO SIZE FOR PROFESSIONAL LOOK */
          .logo-img {
            max-height: 48px !important; 
            margin-left: -8px; /* Slightly shifts left to align nicely with edge */
          }

          /* Solid background on mobile */
          .premium-navbar {
            background: rgba(3, 7, 4, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
            padding: 16px 0 !important;
          }
        }
      `}</style>
    </>
  );
}
