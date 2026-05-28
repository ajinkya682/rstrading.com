import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Key, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDate';

const mockPins = [
  { pin: 'EP-ADMIN-001', generated: '2025-05-01', assignedTo: 'RS1010', usedBy: 'RS1010', status: 'Used' },
  { pin: 'EP-ADMIN-002', generated: '2025-05-01', assignedTo: 'RS1011', usedBy: null, status: 'Available' },
  { pin: 'EP-ADMIN-003', generated: '2025-05-10', assignedTo: null, usedBy: null, status: 'Available' },
  { pin: 'EP-ADMIN-004', generated: '2025-05-15', assignedTo: 'RS1012', usedBy: null, status: 'Transferred' },
];

export default function EPinManagement() {
  const [pins, setPins] = useState(mockPins);
  const [genCount, setGenCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const generatePins = async (e) => {
    e.preventDefault();
    if (!genCount || genCount < 1 || genCount > 1000) { toast.error('Enter 1–1000 pins'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newPins = Array.from({ length: Math.min(genCount, 5) }, (_, i) => ({
      pin: `EP-${Date.now()}-${i + 1}`,
      generated: new Date().toISOString().split('T')[0],
      assignedTo: null, usedBy: null, status: 'Available',
    }));
    setPins(p => [...newPins, ...p]);
    toast.success(`${genCount} E-Pins generated!`);
    setLoading(false);
  };

  const filtered = filter === 'All' ? pins : pins.filter(p => p.status === filter);
  const statusColors = { Available: 'badge-green', Used: 'badge-gray', Transferred: 'badge-blue' };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>E-Pin Management</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Generate, track, and manage E-Pins for member activation.</p>
      </div>

      {/* Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Generated', value: '12,840', color: '#1E3A5F' },
          { label: 'Available', value: '2,420', color: '#10B981' },
          { label: 'Used', value: '9,880', color: '#64748B' },
          { label: 'Transferred', value: '540', color: '#F59E0B' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stats-card">
            <p style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 12, color: '#64748B' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Generator */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(30,58,95,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={20} color="#1E3A5F" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Generate E-Pins</h3>
          </div>
          <form onSubmit={generatePins} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="input-label">Number of Pins (1–1000)</label>
              <input type="number" className="input" min={1} max={1000} value={genCount} onChange={e => setGenCount(Number(e.target.value))} />
            </div>
            <div>
              <label className="input-label">Notes (optional)</label>
              <input className="input" placeholder="e.g. Batch May 2025" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ gap: 6, justifyContent: 'center' }}>
              <Plus size={16} /> {loading ? 'Generating...' : `Generate ${genCount} Pins`}
            </button>
            <button type="button" className="btn btn-outline btn-sm" style={{ gap: 6, justifyContent: 'center' }}>
              <Download size={14} /> Export All Pins CSV
            </button>
          </form>
        </motion.div>

        {/* Pin Table */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {['All', 'Available', 'Used', 'Transferred'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead><tr><th>Pin Code</th><th>Generated</th><th>Assigned To</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(pin => (
                  <tr key={pin.pin}>
                    <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, letterSpacing: 0.5, fontSize: 12 }}>{pin.pin}</td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(pin.generated)}</td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>{pin.assignedTo || '—'}</td>
                    <td><span className={`badge ${statusColors[pin.status]}`}>{pin.status}</span></td>
                    <td>
                      {pin.status === 'Available' && (
                        <button className="btn btn-ghost btn-sm" style={{ gap: 4 }}
                          onClick={() => { navigator.clipboard.writeText(pin.pin); toast.success('Pin copied!'); }}>
                          <Copy size={13} /> Copy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
