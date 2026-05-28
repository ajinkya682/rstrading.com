import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Wallet, Clock, Key, UserPlus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const dailyRegs = [
  { day: '1', regs: 12 }, { day: '5', regs: 18 }, { day: '10', regs: 24 }, { day: '15', regs: 16 },
  { day: '20', regs: 32 }, { day: '25', regs: 28 }, { day: '30', regs: 41 },
];

const monthlyPayouts = [
  { month: 'Jan', amount: 180000 }, { month: 'Feb', amount: 220000 }, { month: 'Mar', amount: 195000 },
  { month: 'Apr', amount: 280000 }, { month: 'May', amount: 310000 },
];

const recentRegs = [
  { rsId: 'RS1115', name: 'Ankit Sharma', mobile: '9876543210', sponsor: 'RS1050', date: '2025-05-27' },
  { rsId: 'RS1114', name: 'Pooja Desai', mobile: '9988776655', sponsor: 'RS1030', date: '2025-05-27' },
  { rsId: 'RS1113', name: 'Vijay Kumar', mobile: '8877665544', sponsor: 'RS1001', date: '2025-05-26' },
  { rsId: 'RS1112', name: 'Sunita Patil', mobile: '7766554433', sponsor: 'RS1010', date: '2025-05-26' },
];

const pendingWithdrawals = [
  { rsId: 'RS1001', name: 'Demo User', amount: 8000, bank: 'SBI ****8921', date: '2025-05-26' },
  { rsId: 'RS1010', name: 'Rahul Sharma', amount: 5000, bank: 'HDFC ****4432', date: '2025-05-25' },
  { rsId: 'RS1020', name: 'Priya Patel', amount: 12000, bank: 'ICICI ****7890', date: '2025-05-24' },
];

function StatCard({ icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="stats-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        {sub && <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600, background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 100 }}>{sub}</span>}
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color }}>{value}</p>
        <p style={{ fontSize: 13, color: '#64748B' }}>{label}</p>
      </div>
    </motion.div>
  );
}

export default function AdminOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard icon={<Users size={20} color="#1E3A5F" />} label="Total Users" value="50,248" sub="+41 today" color="#1E3A5F" delay={0} />
        <StatCard icon={<TrendingUp size={20} color="#10B981" />} label="Active Users" value="38,102" color="#10B981" delay={0.07} />
        <StatCard icon={<Wallet size={20} color="#F59E0B" />} label="Income Distributed" value="₹1.04Cr" color="#F59E0B" delay={0.14} />
        <StatCard icon={<Clock size={20} color="#EF4444" />} label="Pending Withdrawals" value="₹2,35,000" color="#EF4444" delay={0.21} />
        <StatCard icon={<Key size={20} color="#6366F1" />} label="E-Pins Generated" value="12,840" color="#6366F1" delay={0.28} />
        <StatCard icon={<UserPlus size={20} color="#22C55E" />} label="Today's Registrations" value="41" sub="↑ 28% vs avg" color="#22C55E" delay={0.35} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="chart-wrapper">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Daily Registrations (Last 30 Days)</h3>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>New user sign-ups per day</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyRegs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} cursor={{ stroke: 'rgba(30,58,95,0.2)', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="regs" stroke="#1E3A5F" strokeWidth={2.5} dot={{ r: 3, fill: '#1E3A5F' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="chart-wrapper">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Monthly Payouts</h3>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Total income distributed per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyPayouts} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip formatter={v => [formatCurrency(v), 'Payout']} contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
              <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Recent Registrations</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>RS ID</th><th>Name</th><th>Sponsor</th><th>Date</th></tr></thead>
            <tbody>
              {recentRegs.map(u => (
                <tr key={u.rsId}>
                  <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, color: '#64748B' }}>{u.rsId}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{u.sponsor}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(u.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Pending Withdrawals</h3>
            <a href="/admin/withdrawals" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All →</a>
          </div>
          <table className="data-table">
            <thead><tr><th>User</th><th>Amount</th><th>Bank</th><th>Date</th></tr></thead>
            <tbody>
              {pendingWithdrawals.map(w => (
                <tr key={w.rsId}>
                  <td>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>{w.rsId}</p>
                  </td>
                  <td style={{ fontWeight: 800, fontFamily: 'Satoshi, sans-serif', color: '#EF4444' }}>{formatCurrency(w.amount)}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{w.bank}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(w.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <style>{`@media (max-width: 900px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
