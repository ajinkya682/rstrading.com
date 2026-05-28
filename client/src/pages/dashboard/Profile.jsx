import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { NOMINEE_RELATIONS, DISTRICTS } from '@/constants/planData';
import { formatDate } from '@/utils/formatDate';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    fullName: user?.fullName || 'Demo User',
    email: user?.email || 'demo@email.com',
    mobile: user?.mobile || '9876543210',
    dob: user?.dob || '1990-01-01',
    address: 'Main Street, City Area',
    nomineeName: 'Spouse Name',
    nomineeRelation: 'Spouse',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ fullName: form.fullName, email: form.email });
    toast.success('Profile updated successfully!');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>My Profile</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Manage your personal information and account details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: Avatar & Static Info */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Avatar Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 800, color: '#fff',
                margin: '0 auto',
              }}>
                {user?.fullName?.charAt(0) || 'D'}
              </div>
              <button style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: '#10B981', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Camera size={13} color="white" />
              </button>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{user?.fullName}</h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>{user?.email}</p>
            <div className="badge badge-green" style={{ margin: '0 auto' }}>
              {user?.isActive ? '✓ Active Member' : '⚠ Inactive'}
            </div>
          </div>

          {/* Static Info */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>Account Info</h3>
            {[
              { label: 'RS Trading ID', value: user?.rsId || 'RS1001' },
              { label: 'Sponsor', value: user?.sponsorName || 'Ramesh Kumar' },
              { label: 'Sponsor ID', value: user?.sponsorId || 'RS1000' },
              { label: 'Join Date', value: formatDate(user?.createdAt || '2025-01-15') },
              { label: 'Current Level', value: `Level ${user?.level || 0}` },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' }}>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginTop: 2 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Editable Form */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Edit Personal Information</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="input-label">Full Name</label>
                <input className="input" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Date of Birth</label>
                <input type="date" className="input" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Mobile Number</label>
                <div style={{ display: 'flex', gap: 0 }}>
                  <span style={{ padding: '10px 12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 14, color: '#64748B', display: 'flex', alignItems: 'center' }}>+91</span>
                  <input className="input" style={{ borderRadius: '0 8px 8px 0' }} value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '') }))} maxLength={10} />
                </div>
              </div>
            </div>
            <div>
              <label className="input-label">Address</label>
              <textarea className="input" rows={3} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="input-label">Nominee Name</label>
                <input className="input" value={form.nomineeName} onChange={e => setForm(f => ({ ...f, nomineeName: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Nominee Relation</label>
                <select className="input" value={form.nomineeRelation} onChange={e => setForm(f => ({ ...f, nomineeRelation: e.target.value }))}>
                  {NOMINEE_RELATIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ gap: 8 }}>
                <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
