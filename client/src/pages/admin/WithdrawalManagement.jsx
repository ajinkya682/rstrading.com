import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

const mockPending = [
  { id: 'WD001', rsId: 'RS1001', name: 'Demo User', amount: 8000, bank: 'State Bank of India', accountNo: '****8921', ifsc: 'SBIN0001234', requestDate: '2025-05-26' },
  { id: 'WD002', rsId: 'RS1010', name: 'Rahul Sharma', amount: 5000, bank: 'HDFC Bank', accountNo: '****4432', ifsc: 'HDFC0001234', requestDate: '2025-05-25' },
  { id: 'WD003', rsId: 'RS1020', name: 'Priya Patel', amount: 12000, bank: 'ICICI Bank', accountNo: '****7890', ifsc: 'ICIC0001234', requestDate: '2025-05-24' },
];

const mockHistory = [
  { id: 'WD000', rsId: 'RS1005', name: 'Vijay Kumar', amount: 6000, status: 'Approved', date: '2025-05-23', txRef: 'NEFT123456' },
  { id: 'WD-1', rsId: 'RS1008', name: 'Sunita Patil', amount: 3000, status: 'Rejected', date: '2025-05-22', reason: 'Bank details mismatch' },
];

function ApproveModal({ item, onClose, onApprove }) {
  const [txRef, setTxRef] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-card" style={{ padding: 28 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Approve Withdrawal</h3>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>Enter transaction details to confirm approval.</p>
        <div style={{ padding: '14px 16px', background: 'rgba(34,197,94,0.06)', borderRadius: 12, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#64748B' }}>{item.name} ({item.rsId}) · {formatCurrency(item.amount)}</p>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>{item.bank} · {item.accountNo}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="input-label">Transaction Reference *</label>
            <input className="input" placeholder="UTR/NEFT/IMPS reference number" value={txRef} onChange={e => setTxRef(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Transaction Date</label>
            <input type="date" className="input" value={txDate} onChange={e => setTxDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1, background: '#22C55E', gap: 6 }}
              onClick={() => { if (!txRef) { toast.error('Enter transaction reference'); return; } onApprove(item.id, txRef, txDate); onClose(); }}>
              <CheckCircle size={16} /> Approve
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function RejectModal({ item, onClose, onReject }) {
  const [reason, setReason] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="modal-card" style={{ padding: 28 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Reject Withdrawal</h3>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>Provide a reason for rejection (will be shown to user).</p>
        <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.06)', borderRadius: 12, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#64748B' }}>{item.name} · {formatCurrency(item.amount)}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="input-label">Rejection Reason *</label>
            <textarea className="input" rows={3} placeholder="e.g. Bank details mismatch, insufficient KYC verification..." value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button className="btn btn-sm" style={{ flex: 1, background: '#EF4444', color: '#fff', gap: 6, borderRadius: 12, padding: '10px', fontWeight: 600 }}
              onClick={() => { if (!reason) { toast.error('Enter rejection reason'); return; } onReject(item.id, reason); onClose(); }}>
              <X size={16} /> Reject
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function WithdrawalManagement() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pending, setPending] = useState(mockPending);
  const [history, setHistory] = useState(mockHistory);
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [selected, setSelected] = useState([]);

  const handleApprove = (id, txRef, txDate) => {
    const item = pending.find(p => p.id === id);
    setPending(p => p.filter(x => x.id !== id));
    setHistory(h => [{ ...item, status: 'Approved', date: txDate, txRef }, ...h]);
    toast.success(`Withdrawal ${id} approved!`);
  };

  const handleReject = (id, reason) => {
    const item = pending.find(p => p.id === id);
    setPending(p => p.filter(x => x.id !== id));
    setHistory(h => [{ ...item, status: 'Rejected', date: new Date().toISOString().split('T')[0], reason }, ...h]);
    toast.success(`Withdrawal ${id} rejected`);
  };

  return (
    <div>
      <AnimatePresence>
        {approveModal && <ApproveModal item={approveModal} onClose={() => setApproveModal(null)} onApprove={handleApprove} />}
        {rejectModal && <RejectModal item={rejectModal} onClose={() => setRejectModal(null)} onReject={handleReject} />}
      </AnimatePresence>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Withdrawal Management</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Review and process member withdrawal requests.</p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#F8FAFC', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid #E2E8F0' }}>
        {[
          { key: 'pending', label: `Pending (${pending.length})` },
          { key: 'history', label: 'History' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
              background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#0F172A' : '#64748B',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pending' && (
          <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {pending.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>
                <CheckCircle size={40} color="#22C55E" style={{ margin: '0 auto 12px' }} />
                <p>All withdrawals processed!</p>
              </div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Request ID</th><th>User</th><th>Amount</th><th>Bank Details</th><th>Request Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {pending.map(w => (
                    <tr key={w.id}>
                      <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, color: '#64748B' }}>{w.id}</td>
                      <td>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</p>
                        <p style={{ fontSize: 11, color: '#94A3B8' }}>{w.rsId}</p>
                      </td>
                      <td><span style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#0F172A', fontSize: 15 }}>{formatCurrency(w.amount)}</span></td>
                      <td style={{ fontSize: 12, color: '#64748B' }}>
                        <p style={{ fontWeight: 600 }}>{w.bank}</p>
                        <p>{w.accountNo} · {w.ifsc}</p>
                      </td>
                      <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(w.requestDate)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-sm" style={{ background: '#22C55E', color: '#fff', gap: 4 }} onClick={() => setApproveModal(w)}>
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button className="btn btn-sm" style={{ background: '#EF4444', color: '#fff', gap: 4 }} onClick={() => setRejectModal(w)}>
                            <X size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th><th>Date</th><th>Reference</th></tr></thead>
              <tbody>
                {history.map(w => (
                  <tr key={w.id}>
                    <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, color: '#64748B' }}>{w.id}</td>
                    <td>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</p>
                      <p style={{ fontSize: 11, color: '#94A3B8' }}>{w.rsId}</p>
                    </td>
                    <td><span style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif' }}>{formatCurrency(w.amount)}</span></td>
                    <td>
                      <span className={`badge ${w.status === 'Approved' ? 'badge-green' : 'badge-red'}`}>{w.status}</span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(w.date)}</td>
                    <td style={{ fontSize: 12, color: '#64748B', fontFamily: 'Satoshi, sans-serif' }}>{w.txRef || w.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
