import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

// Import your actual logo to match the Navbar
import logo from "../../assets/images/logo.png";

const FacebookIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
const InstagramIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);
const TwitterIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);
const YoutubeIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Business Plan", to: "/business-plan" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Contact Us", to: "/contact" },
];

const supportLinks = [
  { label: "Register", to: "/register" },
  { label: "Login", to: "/login" },
  { label: "FAQ", to: "/#faq" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className="premium-footer">
      {/* Subtle ambient light to separate content from footer */}
      <div className="footer-ambient-glow" />

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-link">
              <img src={logo} alt="RS Trading Logo" className="footer-logo" />
            </Link>
            <p className="footer-desc">
              India's premium digital business network. Build your team, grow
              your income, and achieve financial freedom through a highly
              transparent referral system.
            </p>
            <div className="social-links">
              {[
                { Icon: FacebookIcon, href: "#" },
                { Icon: InstagramIcon, href: "#" },
                { Icon: TwitterIcon, href: "#" },
                { Icon: YoutubeIcon, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="social-icon">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links-list">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <div className="contact-list">
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>support@rstradingonline.co.in</span>
              </div>
              <div className="contact-item">
                <Phone size={16} className="contact-icon gold" />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>Maharashtra, India</span>
              </div>
            </div>

            {/* Premium Glassmorphism Business Hours Card */}
            <div className="business-hours-card">
              <p className="hours-title">Business Hours</p>
              <p className="hours-text">Mon – Sat: 9:00 AM – 6:00 PM</p>
              <p className="hours-text">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} RS Trading. All rights reserved.
          </p>
          <div className="legal-links">
            {["Privacy Policy", "Terms & Conditions", "Refund Policy"].map(
              (item) => (
                <Link key={item} to="#" className="legal-link">
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      <style>{`
        .premium-footer {
          position: relative;
          background-color: #030704; /* Matches the dark theme */
          color: #94A3B8;
          padding-top: 80px;
          font-family: "Satoshi", "Manrope", sans-serif;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .footer-ambient-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
          box-shadow: 0 0 30px 2px rgba(212, 175, 55, 0.05);
        }

        .footer-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 56px;
          padding-bottom: 64px;
        }

        /* Brand Column */
        .footer-brand-col {
          display: flex;
          flex-direction: column;
        }

        .footer-logo-link {
          display: inline-block;
          margin-bottom: 24px;
          text-decoration: none;
        }

        .footer-logo {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .footer-desc {
          font-size: 15px;
          line-height: 1.7;
          color: #94A3B8;
          margin-bottom: 32px;
        }

        /* Social Icons */
        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-icon:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.3);
          color: #D4AF37;
          transform: translateY(-3px);
        }

        /* Headings & Links */
        .footer-heading {
          color: #FFF;
          font-family: 'Satoshi', sans-serif;
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 24px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-link {
          color: #94A3B8;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #10B981; /* Emerald hover */
        }

        /* Contact Details */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          color: #94A3B8;
        }

        .contact-icon {
          color: #10B981; /* Emerald */
          margin-top: 2px;
          flex-shrink: 0;
        }

        .contact-icon.gold {
          color: #D4AF37; /* Mixed accent colors for premium feel */
        }

        /* Business Hours Glass Card */
        .business-hours-card {
          margin-top: 32px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(16, 185, 129, 0.05));
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hours-title {
          font-size: 13px;
          color: #D4AF37;
          font-weight: 700;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hours-text {
          font-size: 14px;
          color: #CBD5E1;
          margin-bottom: 4px;
        }

        .hours-text:last-child {
          margin-bottom: 0;
        }

        /* Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .copyright-text {
          font-size: 14px;
          color: #64748B;
        }

        .legal-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .legal-link {
          font-size: 14px;
          color: #64748B;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #D4AF37;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .premium-footer {
            padding-top: 60px;
          }
          .footer-grid {
            gap: 40px;
          }
          .footer-bottom-bar {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }
          .legal-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
