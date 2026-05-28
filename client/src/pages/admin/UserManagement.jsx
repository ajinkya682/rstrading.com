import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Edit, Ban, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';

const mockUsers = [
  { rsId: 'RS1001', name: 'Demo User', mobile: '9876543210', email: 'demo@email.com', sponsor: 'RS1000', joinDate: '2025-01-15', level: 3, status: 'Active' },
  { rsId: 'RS1010', name: 'Rahul Sharma', mobile: '9988776655', email: 'rahul@email.com', sponsor: 'RS1001', joinDate: '2025-01-20', level: 2, status: 'Active' },
  { rsId: 'RS1011', name: 'Suresh Mane', mobile: '8877665544', email: 'suresh@email.com', sponsor: 'RS1001', joinDate: '2025-02-14', level: 1, status: 'Active' },
  { rsId: 'RS1012', name: 'Kavya Raut', mobile: '7766554433', email: 'kavya@email.com', sponsor: 'RS1001', joinDate: '2025-03-05', level: 0, status: 'Inactive' },
  { rsId: 'RS1013', name: 'Meena Devi', mobile: '6655443322', email: 'meena@email.com', sponsor: 'RS1001', joinDate: '2025-04-18', level: 1, status: 'Active' },
  { rsId: 'RS1020', name: 'Priya Patel', mobile: '5544332211', email: 'priya@email.com', sponsor: 'RS1010', joinDate: '2025-02-20', level: 1, status: 'Active' },
  { rsId: 'RS1021', name: 'Amit Kumar', mobile: '4433221100', email: 'amit@email.com', sponsor: 'RS1010', joinDate: '2025-03-10', level: 0, status: 'Blocked' },
];

function UserDetailModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal-card" style={{ padding: 0, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 17, fontWeight: 800 }}>User Details</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{user.name}</h4>
              <p style={{ fontSize: 13, color: '#64748B' }}>{user.rsId} · {user.email}</p>
              <div className={`badge ${user.status === 'Active' ? 'badge-green' : user.status === 'Blocked' ? 'badge-red' : 'badge-gold'}`} style={{ marginTop: 4 }}>
                {user.status}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'RS ID', value: user.rsId },
              { label: 'Mobile', value: user.mobile },
              { label: 'Sponsor ID', value: user.sponsor },
              { label: 'Join Date', value: formatDate(user.joinDate) },
              { label: 'Current Level', value: `Level ${user.level}` },
              { label: 'Status', value: user.status },
            ].map(f => (
              <div key={f.label} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 10 }}>
                <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{f.label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{f.value}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-primary btn-sm" style={{ gap: 6 }} onClick={() => { toast.success('User activated!'); onClose(); }}>
              <CheckCircle size={14} /> Activate
            </button>
            <button className="btn btn-sm" style={{ background: '#EF4444', color: '#fff', gap: 6 }} onClick={() => { toast.success('User blocked!'); onClose(); }}>
              <Ban size={14} /> Block
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = mockUsers.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.rsId.toLowerCase().includes(q) || u.mobile.includes(q);
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const statusColors = { Active: 'badge-green', Inactive: 'badge-gold', Blocked: 'badge-red' };

  return (
    <div>
      <AnimatePresence>
        {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>User Management</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>View, manage, and take actions on all platform members.</p>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input className="input" placeholder="Search by name, RS ID, or mobile..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: 36 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Active', 'Inactive', 'Blocked'].map(s => (
              <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}>{s}</button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: '#64748B' }}>{filtered.length} users found</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>RS ID</th><th>Name</th><th>Mobile</th><th>Sponsor</th><th>Join Date</th><th>Level</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.map(user => (
                <tr key={user.rsId}>
                  <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, color: '#64748B', fontSize: 12 }}>{user.rsId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {user.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#64748B' }}>{user.mobile}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{user.sponsor}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(user.joinDate)}</td>
                  <td>
                    {user.level > 0 ? (
                      <span className="badge badge-gold">L{user.level}</span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>
                    )}
                  </td>
                  <td><span className={`badge ${statusColors[user.status]}`}>{user.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(user)} title="View" style={{ padding: '4px 8px' }}><Eye size={14} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Edit user clicked')} title="Edit" style={{ padding: '4px 8px' }}><Edit size={14} /></button>
                      <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', padding: '4px 8px' }}
                        onClick={() => toast.success(`${user.name} ${user.status === 'Blocked' ? 'unblocked' : 'blocked'}!`)} title="Block">
                        <Ban size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>Page {page} of {totalPages}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={16} /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
