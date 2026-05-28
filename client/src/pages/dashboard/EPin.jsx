import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Send, CheckCircle, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDate';

const mockPins = [
  { pin: 'EP123456', status: 'Available', created: '2025-05-01', used: null },
  { pin: 'EP234567', status: 'Used', created: '2025-04-10', used: '2025-04-15' },
  { pin: 'EP345678', status: 'Transferred', created: '2025-03-20', used: null },
  { pin: 'EP456789', status: 'Available', created: '2025-05-10', used: null },
];

const transferHistory = [
  { pin: 'EP345678', to: 'RS1050 — Amit Kumar', date: '2025-04-01' },
];

export default function EPin() {
  const [activeTab, setActiveTab] = useState('my');
  const [filter, setFilter] = useState('All');
  const [transferForm, setTransferForm] = useState({ recipientId: '', pin: '' });
  const [loading, setLoading] = useState(false);

  const filtered = filter === 'All' ? mockPins : mockPins.filter(p => p.status === filter);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.recipientId || !transferForm.pin) { toast.error('Fill all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success(`E-Pin ${transferForm.pin} transferred to ${transferForm.recipientId}`);
    setTransferForm({ recipientId: '', pin: '' });
    setLoading(false);
  };

  const statusColors = { Available: 'badge-green', Used: 'badge-gray', Transferred: 'badge-blue' };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>E-Pin Management</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Manage and transfer your E-Pins.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#F8FAFC', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid #E2E8F0' }}>
        {['my', 'transfer'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#0F172A' : '#64748B',
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>
            {tab === 'my' ? '🔑 My E-Pins' : '→ Transfer E-Pin'}
          </button>
        ))}
      </div>

      {activeTab === 'my' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {['All', 'Available', 'Used', 'Transferred'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '6px 14px' }}>
                {f}
              </button>
            ))}
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead><tr><th>Pin Code</th><th>Status</th><th>Created</th><th>Used Date</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(pin => (
                  <tr key={pin.pin}>
                    <td>
                      <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, letterSpacing: 1, fontSize: 14 }}>{pin.pin}</span>
                    </td>
                    <td><span className={`badge ${statusColors[pin.status]}`}>{pin.status}</span></td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{formatDate(pin.created)}</td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{pin.used ? formatDate(pin.used) : '—'}</td>
                    <td>
                      {pin.status === 'Available' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(pin.pin); toast.success('Pin copied!'); }}>
                          <Copy size={14} /> Copy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'transfer' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Transfer E-Pin</h3>
            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="input-label">Recipient RS ID *</label>
                <input className="input" placeholder="Enter recipient's RS ID" value={transferForm.recipientId}
                  onChange={e => setTransferForm(f => ({ ...f, recipientId: e.target.value.toUpperCase() }))} />
              </div>
              <div>
                <label className="input-label">Select E-Pin *</label>
                <select className="input" value={transferForm.pin} onChange={e => setTransferForm(f => ({ ...f, pin: e.target.value }))}>
                  <option value="">Select an available pin</option>
                  {mockPins.filter(p => p.status === 'Available').map(p => (
                    <option key={p.pin} value={p.pin}>{p.pin}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', gap: 8 }}>
                <Send size={16} /> {loading ? 'Transferring...' : 'Transfer E-Pin'}
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Transfer History</h3>
            </div>
            <table className="data-table">
              <thead><tr><th>Pin Code</th><th>Transferred To</th><th>Date</th></tr></thead>
              <tbody>
                {transferHistory.map(t => (
                  <tr key={t.pin}>
                    <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700 }}>{t.pin}</td>
                    <td style={{ fontSize: 13 }}>{t.to}</td>
                    <td style={{ fontSize: 13, color: '#64748B' }}>{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
