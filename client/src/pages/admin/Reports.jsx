import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart2, Users, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatCurrency';

const growthData = [
  { month: 'Jan', users: 41200 }, { month: 'Feb', users: 43800 }, { month: 'Mar', users: 45200 },
  { month: 'Apr', users: 47600 }, { month: 'May', users: 50248 },
];

const incomeDistribution = [
  { name: 'Direct Income', value: 42000000, color: '#10B981' },
  { name: 'Level 1', value: 18500000, color: '#1E3A5F' },
  { name: 'Level 2', value: 15000000, color: '#F59E0B' },
  { name: 'Level 3-9', value: 29000000, color: '#6366F1' },
];

const levelData = [
  { level: 'L1', users: 1240, payout: 1860000 },
  { level: 'L2', users: 520, payout: 2600000 },
  { level: 'L3', users: 188, payout: 1316000 },
  { level: 'L4', users: 64, payout: 640000 },
  { level: 'L5', users: 18, payout: 360000 },
  { level: 'L6', users: 5, payout: 200000 },
  { level: 'L7', users: 2, payout: 120000 },
];

const topEarners = [
  { rsId: 'RS0042', name: 'Prakash Mehta', level: 7, totalIncome: 280000, team: 9240 },
  { rsId: 'RS0018', name: 'Savita Joshi', level: 6, totalIncome: 195000, team: 6320 },
  { rsId: 'RS0031', name: 'Deepak Sharma', level: 6, totalIncome: 182000, team: 6100 },
  { rsId: 'RS1001', name: 'Demo User', level: 3, totalIncome: 48500, team: 312 },
];

export default function Reports() {
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const reportCards = [
    { id: 'growth', icon: <Users size={20} color="#1E3A5F" />, label: 'User Growth Report', color: '#1E3A5F' },
    { id: 'income', icon: <TrendingUp size={20} color="#10B981" />, label: 'Income Distribution Report', color: '#10B981' },
    { id: 'level', icon: <BarChart2 size={20} color="#F59E0B" />, label: 'Level-wise Payout Report', color: '#F59E0B' },
    { id: 'top', icon: <Award size={20} color="#6366F1" />, label: 'Top Earners Report', color: '#6366F1' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Reports & Analytics</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Comprehensive platform analytics and exportable reports.</p>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <label className="input-label">From Date</label>
            <input type="date" className="input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div>
            <label className="input-label">To Date</label>
            <input type="date" className="input" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm">Apply Filter</button>
        </div>
      </motion.div>

      {/* Report Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {reportCards.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card card-hover" style={{ cursor: 'pointer' }}
            onClick={() => toast.success(`${r.label} export started...`)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${r.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {r.icon}
              </div>
              <Download size={16} color="#94A3B8" />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{r.label}</p>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Click to export</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="chart-wrapper">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>User Growth (Monthly)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Line type="monotone" dataKey="users" stroke="#1E3A5F" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="chart-wrapper">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Income Distribution by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={incomeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {incomeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [formatCurrency(v), 'Income']} contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Level Payouts */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="chart-wrapper" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Level-wise Qualified Users & Total Payouts</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={levelData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
            <Bar yAxisId="left" dataKey="users" fill="#1E3A5F" radius={[4, 4, 0, 0]} name="Users" />
            <Bar yAxisId="right" dataKey="payout" fill="#10B981" radius={[4, 4, 0, 0]} name="Payout (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Earners */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Top Earners</h3>
        </div>
        <table className="data-table">
          <thead><tr><th>Rank</th><th>User</th><th>Level</th><th>Total Income</th><th>Team Size</th></tr></thead>
          <tbody>
            {topEarners.map((e, i) => (
              <tr key={e.rsId}>
                <td>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: ['#F59E0B', '#94A3B8', '#CD7F32', '#64748B'][i] || '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>
                    {i + 1}
                  </div>
                </td>
                <td>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8' }}>{e.rsId}</p>
                </td>
                <td><span className="badge badge-gold">Level {e.level}</span></td>
                <td><span style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#10B981', fontSize: 15 }}>{formatCurrency(e.totalIncome)}</span></td>
                <td style={{ fontSize: 13, fontWeight: 600 }}>{e.team.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <style>{`@media (max-width: 900px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
