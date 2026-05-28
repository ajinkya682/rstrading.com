import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function StrengthBar({ password }) {
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 || !/[A-Z]/.test(password) ? 2 : 3;
  const labels = ['', 'Weak', 'Medium', 'Strong'];
  const colors = ['', '#EF4444', '#F59E0B', '#22C55E'];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 100,
            background: strength >= i ? colors[strength] : '#E2E8F0',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {password && (
        <p style={{ fontSize: 12, fontWeight: 600, color: colors[strength], marginTop: 4 }}>
          {labels[strength]} password
        </p>
      )}
    </div>
  );
}

export default function ChangePassword() {
  const [form, setForm] = useState({ current: '', new: '', confirm: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current) { toast.error('Enter current password'); return; }
    if (form.new.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (form.new !== form.confirm) { toast.error('New passwords do not match'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Password changed successfully!');
    setForm({ current: '', new: '', confirm: '' });
    setLoading(false);
  };

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Change Password</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Update your account password. Use a strong, unique password.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Current Password */}
          <div>
            <label className="input-label">Current Password *</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={show.current ? 'text' : 'password'} placeholder="Enter current password" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => toggle('current')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ height: 1, background: '#E2E8F0' }} />

          {/* New Password */}
          <div>
            <label className="input-label">New Password *</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={show.new ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.new} onChange={e => setForm(f => ({ ...f, new: e.target.value }))} style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => toggle('new')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <StrengthBar password={form.new} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="input-label">Confirm New Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`input ${form.confirm && form.new !== form.confirm ? 'input-error' : form.confirm && form.new === form.confirm ? '' : ''}`}
                type={show.confirm ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => toggle('confirm')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.confirm && form.new === form.confirm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <CheckCircle size={14} color="#22C55E" />
                <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>Passwords match</span>
              </div>
            )}
            {form.confirm && form.new !== form.confirm && (
              <p className="input-error-msg">Passwords do not match</p>
            )}
          </div>

          {/* Password requirements */}
          <div style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>
            <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>Password Requirements:</p>
            {['At least 8 characters', 'Mix of uppercase and lowercase', 'Include numbers and symbols'].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                {r}
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? 'Changing...' : <><Lock size={16} /> Change Password</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
