import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, FileText } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

const mockStatements = [
  { id: 'INC001', type: 'Direct Income', from: 'Rahul Sharma (RS1010)', amount: 1500, date: '2025-05-26' },
  { id: 'INC002', type: 'Level 2 Income', from: 'Team Growth', amount: 5000, date: '2025-05-24' },
  { id: 'INC003', type: 'Direct Income', from: 'Suresh Mane (RS1011)', amount: 1500, date: '2025-05-22' },
  { id: 'INC004', type: 'Level 3 Income', from: 'Team Growth', amount: 7000, date: '2025-05-20' },
  { id: 'INC005', type: 'Direct Income', from: 'Meena Devi (RS1013)', amount: 1500, date: '2025-05-18' },
  { id: 'INC006', type: 'Direct Income', from: 'Kavya Raut (RS1012)', amount: 1500, date: '2025-04-30' },
  { id: 'INC007', type: 'Level 1 Income', from: 'Team Growth', amount: 1500, date: '2025-04-25' },
  { id: 'INC008', type: 'Level 2 Income', from: 'Team Growth', amount: 5000, date: '2025-04-18' },
];

const TYPE_COLORS = {
  'Direct Income': 'badge-green',
  'Level 1 Income': 'badge-blue',
  'Level 2 Income': 'badge-blue',
  'Level 3 Income': 'badge-blue',
};

export default function Statement() {
  const [fromDate, setFromDate] = useState('2025-04-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = mockStatements.filter(s => {
    const d = new Date(s.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (typeFilter !== 'All' && !s.type.includes(typeFilter)) return false;
    return true;
  });

  const total = filtered.reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Income Statement</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>View and export your complete income history.</p>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 14, alignItems: 'end' }}>
          <div>
            <label className="input-label">From Date</label>
            <input type="date" className="input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="input-label">To Date</label>
            <input type="date" className="input" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Income Type</label>
            <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option>All</option>
              <option>Direct</option>
              <option>Level</option>
            </select>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => toast.success('Exporting PDF...')} style={{ gap: 6 }}>
            <Download size={14} /> PDF
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => toast.success('Exporting CSV...')} style={{ gap: 6 }}>
            <Download size={14} /> CSV
          </button>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ padding: '16px 20px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={18} color="#10B981" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{filtered.length} transactions in selected period</span>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>TOTAL: </span>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: '#10B981' }}>{formatCurrency(total)}</span>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr><th>Reference ID</th><th>Income Type</th><th>From</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, color: '#64748B' }}>{s.id}</td>
                <td><span className={`badge ${TYPE_COLORS[s.type] || 'badge-gray'}`}>{s.type}</span></td>
                <td style={{ fontSize: 13 }}>{s.from}</td>
                <td><span style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#22C55E' }}>+{formatCurrency(s.amount)}</span></td>
                <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(s.date)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 14 }}>No transactions found for selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
