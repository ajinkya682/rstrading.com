import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, MessageCircle, Send, QrCode, Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/formatDate';

const mockReferrals = [
  { rsId: 'RS1010', name: 'Rahul Sharma', date: '2025-01-20', status: 'Active', income: 3000 },
  { rsId: 'RS1011', name: 'Suresh Mane', date: '2025-02-14', status: 'Active', income: 1500 },
  { rsId: 'RS1012', name: 'Kavya Raut', date: '2025-03-05', status: 'Inactive', income: 0 },
  { rsId: 'RS1013', name: 'Meena Devi', date: '2025-04-18', status: 'Active', income: 1500 },
];

export default function Referral() {
  const { user } = useAuthStore();
  const referralLink = `${import.meta.env.VITE_SITE_URL || 'https://rstradingonline.co.in'}/register?ref=${user?.rsId || 'RS1001'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join RS Trading using my referral link and start earning! ${referralLink}`)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join RS Trading and start earning income!')}`, '_blank');
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Referral Program</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Share your unique referral link and grow your team.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Referred', value: 4, color: '#10B981' },
          { label: 'Active Referred', value: 3, color: '#22C55E' },
          { label: 'Pending Activation', value: 1, color: '#F59E0B' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stats-card">
            <p style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 13, color: '#64748B' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Referral Link */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Your Referral Link</h3>
        <div className="referral-box" style={{ marginBottom: 16 }}>
          <span style={{ flex: 1, fontSize: 13, color: '#0F172A', fontFamily: 'Satoshi, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {referralLink}
          </span>
          <button className="btn btn-primary btn-sm" onClick={copyLink} style={{ flexShrink: 0, gap: 6 }}>
            <Copy size={14} /> Copy
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" onClick={shareWhatsApp} style={{ background: '#25D366', color: '#fff', gap: 6 }}>
            <MessageCircle size={15} /> WhatsApp
          </button>
          <button className="btn btn-sm" onClick={shareTelegram} style={{ background: '#0088cc', color: '#fff', gap: 6 }}>
            <Send size={15} /> Telegram
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => {
            if (navigator.share) navigator.share({ title: 'RS Trading', url: referralLink });
            else copyLink();
          }} style={{ gap: 6 }}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </motion.div>

      {/* QR Code */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card" style={{ marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{
          width: 140, height: 140, background: '#F8FAFC', border: '1px solid #E2E8F0',
          borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {/* QR placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <QrCode size={48} color="#10B981" />
            <span style={{ fontSize: 11, color: '#94A3B8' }}>QR Code</span>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>QR Code for Your Referral Link</h3>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 14 }}>
            Share this QR code at events, on social media, or print it for offline sharing. Anyone who scans it will be directed to your referral link.
          </p>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }}>
            <Download size={14} /> Download QR Code
          </button>
        </div>
      </motion.div>

      {/* Referral Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>My Direct Referrals</h3>
        </div>
        <table className="data-table">
          <thead><tr><th>Name</th><th>RS ID</th><th>Joined</th><th>Status</th><th>Income Generated</th></tr></thead>
          <tbody>
            {mockReferrals.map(r => (
              <tr key={r.rsId}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      {r.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, color: '#64748B' }}>{r.rsId}</td>
                <td style={{ fontSize: 13, color: '#64748B' }}>{formatDate(r.date)}</td>
                <td><span className={`badge ${r.status === 'Active' ? 'badge-green' : 'badge-gold'}`}>{r.status}</span></td>
                <td><span style={{ fontWeight: 700, color: '#10B981', fontFamily: 'Satoshi, sans-serif' }}>₹{r.income.toLocaleString('en-IN')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
