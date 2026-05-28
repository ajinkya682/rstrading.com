import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Wallet, Award, Share2, ArrowUpRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

// Mock data
const monthlyIncome = [
  { month: 'Jun', income: 4200 }, { month: 'Jul', income: 5800 }, { month: 'Aug', income: 4900 },
  { month: 'Sep', income: 7200 }, { month: 'Oct', income: 6100 }, { month: 'Nov', income: 8400 },
  { month: 'Dec', income: 9200 }, { month: 'Jan', income: 7800 }, { month: 'Feb', income: 11200 },
  { month: 'Mar', income: 10400 }, { month: 'Apr', income: 12800 }, { month: 'May', income: 14200 },
];

const incomeBreakdown = [
  { name: 'Direct Income', value: 18500, color: '#10B981' },
  { name: 'Level 1', value: 7500, color: '#1E3A5F' },
  { name: 'Level 2', value: 5000, color: '#F59E0B' },
  { name: 'Level 3', value: 4200, color: '#6366F1' },
  { name: 'Higher Levels', value: 13300, color: '#EC4899' },
];

const recentTransactions = [
  { id: 'TXN001', type: 'credit', desc: 'Level 2 Income - Priya P.', amount: 5000, date: '2025-05-26', balance: 12200 },
  { id: 'TXN002', type: 'credit', desc: 'Direct Income - Amit K.', amount: 1500, date: '2025-05-25', balance: 7200 },
  { id: 'TXN003', type: 'debit', desc: 'Withdrawal Processed', amount: 8000, date: '2025-05-24', balance: 5700 },
  { id: 'TXN004', type: 'credit', desc: 'Level 1 Income - Suresh M.', amount: 1500, date: '2025-05-23', balance: 13700 },
  { id: 'TXN005', type: 'credit', desc: 'Direct Income - Kavya R.', amount: 1500, date: '2025-05-22', balance: 12200 },
];

const recentJoins = [
  { name: 'Priya Patel', rsId: 'RS1092', city: 'Pune', date: '2025-05-26', status: 'Active' },
  { name: 'Suresh Mane', rsId: 'RS1085', city: 'Nashik', date: '2025-05-25', status: 'Active' },
  { name: 'Kavya Raut', rsId: 'RS1078', city: 'Aurangabad', date: '2025-05-24', status: 'Inactive' },
  { name: 'Deepak Shah', rsId: 'RS1071', city: 'Mumbai', date: '2025-05-23', status: 'Active' },
  { name: 'Sneha Joshi', rsId: 'RS1064', city: 'Kolhapur', date: '2025-05-22', status: 'Active' },
];

function StatCard({ icon, label, value, trend, trendUp, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="stats-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '4px 8px', borderRadius: 20,
            background: trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          }}>
            {trendUp ? <TrendingUp size={12} color="#22C55E" /> : <TrendingDown size={12} color="#EF4444" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: trendUp ? '#22C55E' : '#EF4444' }}>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{label}</p>
      </div>
    </motion.div>
  );
}

export default function Overview() {
  const { user } = useAuthStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.fullName?.split(' ')[0]} 👋
        </h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Here's what's happening with your RS Trading account today.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard icon={<Wallet size={20} color="#10B981" />} label="Total Income" value="₹48,500" trend="+12.3%" trendUp color="#10B981" delay={0} />
        <StatCard icon={<Share2 size={20} color="#1E3A5F" />} label="Direct Income" value="₹18,500" trend="+8.4%" trendUp color="#1E3A5F" delay={0.07} />
        <StatCard icon={<Award size={20} color="#F59E0B" />} label="Current Level" value="Level 3" color="#F59E0B" delay={0.14} />
        <StatCard icon={<Users size={20} color="#6366F1" />} label="Total Referrals" value="48" trend="+5 this week" trendUp color="#6366F1" delay={0.21} />
        <StatCard icon={<TrendingUp size={20} color="#EC4899" />} label="Active Team" value="312" trend="+24 today" trendUp color="#EC4899" delay={0.28} />
        <StatCard icon={<Wallet size={20} color="#059669" />} label="Wallet Balance" value="₹12,200" color="#059669" delay={0.35} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="chart-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Income Overview</h3>
              <p style={{ fontSize: 12, color: '#64748B' }}>Last 12 months</p>
            </div>
            <div className="badge badge-green">+32% YoY</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip
                formatter={v => [formatCurrency(v), 'Income']}
                contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}
                cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: '#10B981' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="chart-wrapper">
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Income Breakdown</h3>
            <p style={{ fontSize: 12, color: '#64748B' }}>By income type</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={incomeBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {incomeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => [formatCurrency(v), 'Income']} contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Transactions</h3>
            <a href="/dashboard/statement" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowUpRight size={13} />
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Description</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {recentTransactions.map(txn => (
                  <tr key={txn.id}>
                    <td style={{ maxWidth: 180 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.desc}</p>
                      <p style={{ fontSize: 11, color: '#94A3B8' }}>{txn.id}</p>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: txn.type === 'credit' ? '#22C55E' : '#EF4444', fontFamily: 'Satoshi, sans-serif' }}>
                        {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(txn.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Joins */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Team Joins</h3>
            <a href="/dashboard/team" style={{ fontSize: 12, color: '#10B981', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View Team <ArrowUpRight size={13} />
            </a>
          </div>
          <div>
            {recentJoins.map((member, i) => (
              <div key={member.rsId} style={{ padding: '14px 24px', borderBottom: i < recentJoins.length - 1 ? '1px solid rgba(226,232,240,0.6)' : 'none', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `hsl(${(i * 60 + 140) % 360}, 60%, 50%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {member.name.charAt(0)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{member.name}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8' }}>{member.rsId} · {member.city}</p>
                </div>
                <div>
                  <div className={`badge ${member.status === 'Active' ? 'badge-green' : 'badge-gold'}`}>
                    {member.status}
                  </div>
                  <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'right', marginTop: 2 }}>{formatDate(member.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`@media (max-width: 900px) {
        div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
      }`}</style>
    </div>
  );
}
