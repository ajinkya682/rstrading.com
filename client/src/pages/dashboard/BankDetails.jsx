import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Edit3, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { BANK_NAMES } from '@/constants/planData';

export default function BankDetails() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bankName: 'State Bank of India',
    accountHolder: user?.fullName || 'Demo User',
    accountNumber: '****8921',
    branchName: 'Pune Main Branch',
    ifscCode: 'SBIN0001234',
    panCard: 'ABCDE1234F',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    toast.success('Bank details updated successfully!');
    setEditing(false);
  };

  const kycItems = [
    { label: 'PAN Card', status: 'Verified', color: '#22C55E' },
    { label: 'Bank Account', status: 'Pending', color: '#F59E0B' },
    { label: 'Aadhaar', status: 'Not Submitted', color: '#94A3B8' },
  ];

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Bank Details</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Manage your linked bank account and KYC verification status.</p>
      </div>

      {/* KYC Status */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>KYC Verification Status</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {kycItems.map(k => (
            <div key={k.label} style={{
              flex: 1, minWidth: 160,
              padding: '14px 16px',
              background: '#F8FAFC',
              borderRadius: 12,
              border: `1px solid ${k.status === 'Verified' ? 'rgba(34,197,94,0.2)' : '#E2E8F0'}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {k.status === 'Verified' ? <CheckCircle size={18} color="#22C55E" /> : <AlertCircle size={18} color={k.color} />}
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{k.label}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: k.color }}>{k.status}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }}>
            <Upload size={14} /> Upload KYC Documents
          </button>
        </div>
      </motion.div>

      {/* Bank Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(30,58,95,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color="#1E3A5F" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Bank Account</h3>
              <p style={{ fontSize: 12, color: '#64748B' }}>Your withdrawal bank account</p>
            </div>
          </div>
          {!editing && (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} style={{ gap: 6 }}>
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Bank Name', value: form.bankName },
              { label: 'Account Holder', value: form.accountHolder },
              { label: 'Account Number', value: form.accountNumber },
              { label: 'Branch Name', value: form.branchName },
              { label: 'IFSC Code', value: form.ifscCode },
              { label: 'PAN Card', value: form.panCard },
            ].map(f => (
              <div key={f.label} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 10 }}>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{f.label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', fontFamily: f.label.includes('IFSC') || f.label.includes('Account') || f.label.includes('PAN') ? 'Satoshi, sans-serif' : 'inherit', letterSpacing: f.label.includes('IFSC') ? 1 : 0 }}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="input-label">Bank Name</label>
                <select className="input" value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}>
                  {BANK_NAMES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Account Holder</label>
                <input className="input" value={form.accountHolder} onChange={e => setForm(f => ({ ...f, accountHolder: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Branch Name</label>
                <input className="input" value={form.branchName} onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">IFSC Code</label>
                <input className="input" value={form.ifscCode} onChange={e => setForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() }))} maxLength={11} />
              </div>
              <div>
                <label className="input-label">PAN Card</label>
                <input className="input" value={form.panCard} onChange={e => setForm(f => ({ ...f, panCard: e.target.value.toUpperCase() }))} maxLength={10} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
