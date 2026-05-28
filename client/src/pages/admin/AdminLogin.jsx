import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    // Mock admin login — any creds work for demo
    const adminUser = {
      rsId: 'ADMIN001', fullName: 'Super Admin', email: form.email,
      role: 'admin', isActive: true,
    };
    setAuth(adminUser, 'admin_mock_token_' + Date.now());
    toast.success('Admin login successful!');
    navigate('/admin');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A, #1E3A5F, #2D5986)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(30,58,95,0.4)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative' }}
        className={shake ? 'shake' : ''}
      >
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 36 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <TrendingUp size={28} color="white" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Admin Panel</h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100 }}>
              <Shield size={12} color="#10B981" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>Secure Admin Access</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Email</label>
              <input
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Manrope, sans-serif', boxSizing: 'border-box' }}
                placeholder="admin@rstradingonline.co.in"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Manrope, sans-serif', boxSizing: 'border-box' }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{
                padding: '14px', background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 15,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                marginTop: 8, transition: 'opacity 0.2s',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
              ← Back to main site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
