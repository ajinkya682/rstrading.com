import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/activation': 'Account Activation',
  '/dashboard/epin': 'E-Pin Management',
  '/dashboard/team': 'Team Network',
  '/dashboard/referral': 'Referral Program',
  '/dashboard/wallet': 'Wallet',
  '/dashboard/statement': 'Income Statement',
  '/dashboard/bank-details': 'Bank Details',
  '/dashboard/profile': 'My Profile',
  '/dashboard/change-password': 'Change Password',
  '/dashboard/support': 'Support Tickets',
};

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 10, transition: 'background 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <div style={{ textAlign: 'left', display: 'none' }} className="user-name">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{user?.fullName}</p>
          <p style={{ fontSize: 11, color: '#64748B' }}>{user?.rsId}</p>
        </div>
        <ChevronDown size={15} color="#64748B" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: '110%', right: 0,
                background: '#fff', border: '1px solid #E2E8F0',
                borderRadius: 14, width: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                zIndex: 99, overflow: 'hidden',
                padding: 6,
              }}
            >
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{user?.fullName}</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>{user?.rsId}</p>
              </div>
              {[
                { label: 'My Profile', to: '/dashboard/profile' },
                { label: 'Change Password', to: '/dashboard/change-password' },
              ].map(item => (
                <Link key={item.label} to={item.to} onClick={() => setOpen(false)}
                  style={{ display: 'block', padding: '9px 12px', fontSize: 13, color: '#475569', textDecoration: 'none', borderRadius: 8, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.target.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  {item.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 4, paddingTop: 4 }}>
                <button onClick={onLogout}
                  style={{ width: '100%', padding: '9px 12px', fontSize: 13, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, fontFamily: 'Manrope, sans-serif', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardLayout() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  return (
    <div className="dashboard-layout">
      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 99, display: 'none' }}
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar isAdmin={false} onClose={() => setSidebarOpen(false)} open={sidebarOpen} />

      <main className="dashboard-main">
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="hamburger-btn"
              onClick={toggleSidebar}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'none' }}
            >
              <Menu size={22} color="#64748B" />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#0F172A', lineHeight: 1 }}>{pageTitle}</h1>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Notification Bell */}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Bell size={20} color="#64748B" />
              <div className="notif-dot" />
            </button>
            <UserDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-overlay { display: block !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
