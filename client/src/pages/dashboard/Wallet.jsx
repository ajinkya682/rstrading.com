import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const mockTxns = [
  { id: 'TXN001', type: 'credit', desc: 'Level 2 Income', amount: 5000, date: '2025-05-26', balance: 12200 },
  { id: 'TXN002', type: 'credit', desc: 'Direct Income — Amit Kumar', amount: 1500, date: '2025-05-25', balance: 7200 },
  { id: 'TXN003', type: 'debit', desc: 'Withdrawal Processed', amount: 8000, date: '2025-05-24', balance: 5700 },
  { id: 'TXN004', type: 'credit', desc: 'Level 1 Income — Suresh M.', amount: 1500, date: '2025-05-23', balance: 13700 },
  { id: 'TXN005', type: 'credit', desc: 'Direct Income — Kavya R.', amount: 1500, date: '2025-05-22', balance: 12200 },
  { id: 'TXN006', type: 'credit', desc: 'Level 3 Income', amount: 7000, date: '2025-05-20', balance: 10700 },
  { id: 'TXN007', type: 'debit', desc: 'Withdrawal Processed', amount: 5000, date: '2025-05-18', balance: 3700 },
  { id: 'TXN008', type: 'credit', desc: 'Direct Income — Rahul S.', amount: 1500, date: '2025-05-15', balance: 8700 },
];

function WithdrawalModal({ onClose }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 500) { toast.error('Minimum withdrawal is ₹500'); return; }
    if (Number(amount) > 12200) { toast.error('Insufficient balance'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success(`Withdrawal request of ₹${amount} submitted! Processing in 2-3 business days.`);
    onClose();
    setLoading(false);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal-card" style={{ padding: 28 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Request Withdrawal</h3>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Minimum ₹500. Processed within 2-3 business days.</p>
        <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: 12, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Available Balance</p>
          <p style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: '#10B981' }}>₹12,200</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="input-label">Withdrawal Amount *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 700, color: '#64748B' }}>₹</span>
              <input className="input" type="number" placeholder="500" min={500} max={12200} value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 30 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Processing...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Wallet() {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const perPage = 5;

  const filtered = filter === 'All' ? mockTxns : mockTxns.filter(t => t.type === (filter === 'Credit' ? 'credit' : 'debit'));
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ maxWidth: 800 }}>
      <AnimatePresence>{showModal && <WithdrawalModal onClose={() => setShowModal(false)} />}</AnimatePresence>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Wallet</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Manage your income and withdrawals.</p>
      </div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #059669, #10B981, #34D399)',
          borderRadius: 20, padding: '32px 28px', marginBottom: 24,
          position: 'relative', overflow: 'hidden',
        }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 100, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <WalletIcon size={20} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Available Balance</span>
          </div>
          <p style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: '#fff', lineHeight: 1 }}>₹12,200</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Last updated: {formatDate(new Date())}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, position: 'relative', zIndex: 1 }}>
          <button className="btn btn-lg" style={{ background: '#fff', color: '#10B981', fontWeight: 700, gap: 8 }}
            onClick={() => setShowModal(true)}>
            <ArrowUpCircle size={18} /> Withdraw
          </button>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { icon: <ArrowDownCircle size={20} color="#22C55E" />, label: 'Total Credited', value: '₹56,200', bg: 'rgba(34,197,94,0.08)' },
          { icon: <ArrowUpCircle size={20} color="#EF4444" />, label: 'Total Withdrawn', value: '₹44,000', bg: 'rgba(239,68,68,0.08)' },
          { icon: <WalletIcon size={20} color="#10B981" />, label: 'Net Balance', value: '₹12,200', bg: 'rgba(16,185,129,0.08)' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stats-card">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#0F172A' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#64748B' }}>{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction History */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Transaction History</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Credit', 'Debit'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Description</th><th>Type</th><th>Amount</th><th>Balance</th><th>Date</th></tr></thead>
            <tbody>
              {paged.map(txn => (
                <tr key={txn.id}>
                  <td>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{txn.desc}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>{txn.id}</p>
                  </td>
                  <td>
                    <span className={`badge ${txn.type === 'credit' ? 'badge-green' : 'badge-red'}`}>
                      {txn.type === 'credit' ? '↑ Credit' : '↓ Debit'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: txn.type === 'credit' ? '#22C55E' : '#EF4444' }}>
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontFamily: 'Satoshi, sans-serif', fontSize: 13 }}>{formatCurrency(txn.balance)}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(txn.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(i + 1)} style={{ minWidth: 32 }}>{i + 1}</button>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={16} /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
