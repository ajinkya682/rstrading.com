import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, Calendar, User, Key } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDate';

export default function Activation() {
  const { user, updateUser } = useAuthStore();
  const [epin, setEpin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isActive = user?.isActive;

  const handleActivate = async (e) => {
    e.preventDefault();
    setError('');
    if (!epin.trim() || epin.length < 6) { setError('Please enter a valid E-Pin'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    // Mock: accept any 6+ char pin
    updateUser({ isActive: true, activationDate: new Date().toISOString(), activationEPin: epin });
    toast.success('Account activated successfully! You can now earn income.');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Account Activation</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Activate your account using an E-Pin to start earning income.</p>
      </div>

      {/* Status Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isActive ? <CheckCircle size={28} color="#22C55E" /> : <Zap size={28} color="#F59E0B" />}
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <div className={`badge ${isActive ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
              {isActive ? '✓ Active' : '⚠ Inactive'}
            </div>
          </div>
          {isActive && (
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              Activated on {formatDate(user?.activationDate || new Date())}
            </p>
          )}
        </div>
      </motion.div>

      {isActive ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Activation Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <Calendar size={16} color="#10B981" />, label: 'Activation Date', value: formatDate(user?.activationDate || new Date()) },
              { icon: <User size={16} color="#1E3A5F" />, label: 'Activated By (Sponsor)', value: user?.sponsorName || 'RS1000 — Ramesh Kumar' },
              { icon: <Key size={16} color="#F59E0B" />, label: 'E-Pin Used', value: user?.activationEPin ? `****${user.activationEPin.slice(-4)}` : '****XXXX' },
            ].map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#F8FAFC', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {d.icon}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.label}</p>
                  <p style={{ fontSize: 14, color: '#0F172A', fontWeight: 600 }}>{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Activate Your Account</h3>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
            Enter your E-Pin below to activate your account. Once activated, you'll start earning income from your team.
          </p>

          <form onSubmit={handleActivate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="input-label">E-Pin Code *</label>
              <input
                className={`input ${error ? 'input-error' : ''}`}
                placeholder="Enter your E-Pin (e.g. EP123456)"
                value={epin}
                onChange={e => { setEpin(e.target.value.toUpperCase()); setError(''); }}
                style={{ fontSize: 16, letterSpacing: 2, fontFamily: 'Satoshi, sans-serif', fontWeight: 600 }}
              />
              {error && <p className="input-error-msg">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? 'Activating...' : <><Zap size={18} /> Activate Account</>}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(245,158,11,0.06)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.2)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#92610a', marginBottom: 6 }}>How to get an E-Pin?</p>
            <ul style={{ fontSize: 13, color: '#64748B', lineHeight: 1.8, paddingLeft: 16 }}>
              <li>Contact your sponsor — they can transfer their available E-Pin to you</li>
              <li>Purchase an E-Pin through the official RS Trading channel</li>
              <li>Contact support at support@rstradingonline.co.in</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
