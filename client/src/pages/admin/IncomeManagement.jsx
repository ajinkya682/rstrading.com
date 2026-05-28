import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Plus, Filter } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const incomeData = [
  { id: 'INC001', user: 'RS1001', name: 'Demo User', type: 'Level 2', amount: 5000, date: '2025-05-26' },
  { id: 'INC002', user: 'RS1010', name: 'Rahul Sharma', type: 'Direct', amount: 1500, date: '2025-05-25' },
  { id: 'INC003', user: 'RS1011', name: 'Suresh Mane', type: 'Level 1', amount: 1500, date: '2025-05-24' },
  { id: 'INC004', user: 'RS1001', name: 'Demo User', type: 'Level 3', amount: 7000, date: '2025-05-23' },
  { id: 'INC005', user: 'RS1020', name: 'Priya Patel', type: 'Direct', amount: 1500, date: '2025-05-22' },
];

const trendData = [
  { month: 'Jan', income: 180000 }, { month: 'Feb', income: 220000 }, { month: 'Mar', income: 195000 },
  { month: 'Apr', income: 280000 }, { month: 'May', income: 310000 },
];

export default function IncomeManagement() {
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ userId: '', type: 'Bonus', amount: '', desc: '' });
  const [loading, setLoading] = useState(false);

  const handleManualIncome = async (e) => {
    e.preventDefault();
    if (!manual.userId || !manual.amount) { toast.error('Fill all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success(`Manual income of ₹${manual.amount} added to ${manual.userId}!`);
    setManual({ userId: '', type: 'Bonus', amount: '', desc: '' });
    setShowManual(false);
    setLoading(false);
  };

  const typeColors = { Direct: 'badge-green', 'Level 1': 'badge-blue', 'Level 2': 'badge-blue', 'Level 3': 'badge-blue', Bonus: 'badge-gold' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Income Management</h2>
          <p style={{ color: '#64748B', fontSize: 14 }}>Track all income transactions and manage manual credits.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }} onClick={() => toast.success('Processing bulk payouts...')}>Bulk Payout</button>
          <button className="btn btn-primary btn-sm" style={{ gap: 6 }} onClick={() => setShowManual(!showManual)}>
            <Plus size={14} /> Manual Income
          </button>
        </div>
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="chart-wrapper" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Monthly Income Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
            <Tooltip formatter={v => [formatCurrency(v), 'Total Income']} contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
            <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Manual Income Form */}
      {showManual && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.02)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#92610a' }}>Add Manual Income</h3>
          <form onSubmit={handleManualIncome} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 14, alignItems: 'end' }}>
            <div>
              <label className="input-label">User RS ID *</label>
              <input className="input" placeholder="e.g. RS1001" value={manual.userId} onChange={e => setManual(m => ({ ...m, userId: e.target.value.toUpperCase() }))} />
            </div>
            <div>
              <label className="input-label">Income Type</label>
              <select className="input" value={manual.type} onChange={e => setManual(m => ({ ...m, type: e.target.value }))}>
                {['Bonus', 'Correction', 'Referral', 'Special'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Amount (₹) *</label>
              <input type="number" className="input" placeholder="0" value={manual.amount} onChange={e => setManual(m => ({ ...m, amount: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-gold" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? 'Adding...' : 'Add Income'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Transaction Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>All Income Transactions</h3>
          <button className="btn btn-ghost btn-sm" style={{ gap: 6 }} onClick={() => toast.success('Exporting...')}><Download size={13} /> Export</button>
        </div>
        <table className="data-table">
          <thead><tr><th>ID</th><th>User</th><th>Type</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {incomeData.map(inc => (
              <tr key={inc.id}>
                <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, color: '#94A3B8' }}>{inc.id}</td>
                <td>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{inc.name}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8' }}>{inc.user}</p>
                </td>
                <td><span className={`badge ${typeColors[inc.type] || 'badge-gray'}`}>{inc.type} Income</span></td>
                <td><span style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#22C55E' }}>+{formatCurrency(inc.amount)}</span></td>
                <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(inc.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
