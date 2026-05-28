import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, LayoutDashboard, Zap, Key, Network, Share2,
  Wallet, FileText, Building2, User, Lock, HeadphonesIcon, LogOut, X,
  Users, BarChart2, Settings, CreditCard, Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const USER_NAV = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Activation', to: '/dashboard/activation', icon: Zap },
  { label: 'E-Pin', to: '/dashboard/epin', icon: Key },
  { label: 'Team Network', to: '/dashboard/team', icon: Network },
  { label: 'Referral', to: '/dashboard/referral', icon: Share2 },
  { label: 'Wallet', to: '/dashboard/wallet', icon: Wallet },
  { label: 'Statement', to: '/dashboard/statement', icon: FileText },
  { label: 'Bank Details', to: '/dashboard/bank-details', icon: Building2 },
  { label: 'Profile', to: '/dashboard/profile', icon: User },
  { label: 'Change Password', to: '/dashboard/change-password', icon: Lock },
  { label: 'Support', to: '/dashboard/support', icon: HeadphonesIcon },
];

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'All Users', to: '/admin/users', icon: Users },
  { label: 'Income Management', to: '/admin/income', icon: BarChart2 },
  { label: 'E-Pin Management', to: '/admin/epin', icon: Key },
  { label: 'Withdrawals', to: '/admin/withdrawals', icon: CreditCard },
  { label: 'Reports', to: '/admin/reports', icon: FileText },
  { label: 'CMS', to: '/admin/cms', icon: Settings },
];

export default function Sidebar({ isAdmin = false, open = false, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV;

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <motion.aside
      className={`sidebar ${open ? 'open' : ''}`}
      style={open ? { transform: 'translateX(0)', boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 101 } : {}}
    >
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        style={{
          display: 'none', position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
        }}
        className="sidebar-close"
      >
        <X size={20} color="#64748B" />
      </button>

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: isAdmin
              ? 'linear-gradient(135deg, #1E3A5F, #2D5986)'
              : 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={20} color="white" />
          </div>
          <div>
            <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 800, fontSize: 17, color: '#0F172A' }}>RS</span>
            <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 800, fontSize: 17, color: isAdmin ? '#1E3A5F' : '#10B981' }}> Trading</span>
            {isAdmin && <div><span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: '#1E3A5F', padding: '1px 6px', borderRadius: 4 }}>ADMIN</span></div>}
          </div>
        </div>
      </div>

      {/* User Info */}
      {!isAdmin && user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', white: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</p>
            <p style={{ fontSize: 12, color: '#64748B' }}>{user?.rsId}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: user?.isActive ? '#22C55E' : '#F59E0B' }} />
              <span style={{ fontSize: 11, color: user?.isActive ? '#22C55E' : '#F59E0B', fontWeight: 600 }}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin'}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? (isAdmin ? 'admin-active' : 'active') : ''}`
              }
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Level Badge (user only) */}
      {!isAdmin && user?.level > 0 && (
        <div style={{ margin: '0 12px 8px', padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: '#92610a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Current Level</p>
          <p style={{ fontSize: 18, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: '#F59E0B' }}>Level {user.level}</p>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={handleLogout}
          className="sidebar-item"
          style={{ width: '100%', cursor: 'pointer', background: 'none', border: 'none', color: '#EF4444', fontFamily: 'Manrope, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close { display: flex !important; }
        }
      `}</style>
    </motion.aside>
  );
}
