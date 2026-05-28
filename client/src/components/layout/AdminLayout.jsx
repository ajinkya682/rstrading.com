import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Bell, Menu, ChevronDown, Shield } from 'lucide-react';
import { useState } from 'react';

const PAGE_TITLES = {
  '/admin': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/income': 'Income Management',
  '/admin/epin': 'E-Pin Management',
  '/admin/withdrawals': 'Withdrawal Management',
  '/admin/reports': 'Reports & Analytics',
  '/admin/cms': 'CMS Management',
};

export default function AdminLayout() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageTitle = PAGE_TITLES[pathname] || 'Admin Panel';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-layout">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 99, display: 'none' }}
            className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <Sidebar isAdmin open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        {/* Admin Top Bar */}
        <div className="dashboard-topbar" style={{ borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger-btn" onClick={toggleSidebar}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'none' }}>
              <Menu size={22} color="#64748B" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: '4px 8px', background: 'rgba(30,58,95,0.1)', borderRadius: 6 }}>
                <Shield size={14} color="#1E3A5F" />
              </div>
              <h1 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#0F172A', lineHeight: 1 }}>{pageTitle}</h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 10 }}>
              <Bell size={20} color="#64748B" />
              <div className="notif-dot" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A5F, #2D5986)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                A
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>Admin</p>
                <p style={{ fontSize: 10, color: '#64748B' }}>Super Admin</p>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#EF4444', fontFamily: 'Manrope, sans-serif', fontWeight: 600 }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
