import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronDown, ChevronRight } from 'lucide-react';

// Mock tree data
const TREE = {
  id: 'RS1001', name: 'You', level: 3, active: true,
  children: [
    {
      id: 'RS1010', name: 'Rahul Sharma', level: 2, active: true,
      children: [
        { id: 'RS1020', name: 'Priya Patel', level: 1, active: true, children: [] },
        { id: 'RS1021', name: 'Amit Kumar', level: 0, active: false, children: [] },
      ]
    },
    {
      id: 'RS1011', name: 'Suresh Mane', level: 1, active: true,
      children: [
        { id: 'RS1022', name: 'Deepak Shah', level: 1, active: true, children: [] },
      ]
    },
    { id: 'RS1012', name: 'Kavya Raut', level: 0, active: false, children: [] },
    { id: 'RS1013', name: 'Meena Devi', level: 1, active: true, children: [] },
  ]
};

function TreeNode({ node, depth = 0, isRoot = false }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children?.length > 0;

  const colors = ['#10B981', '#1E3A5F', '#F59E0B', '#6366F1', '#EC4899'];
  const color = colors[depth % colors.length];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px',
            background: isRoot ? `${color}15` : '#fff',
            border: `1.5px solid ${isRoot ? color : '#E2E8F0'}`,
            borderRadius: 12,
            cursor: hasChildren ? 'pointer' : 'default',
            transition: 'all 0.2s',
            minWidth: 200,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onClick={() => hasChildren && setExpanded(!expanded)}
          onMouseEnter={e => !isRoot && (e.currentTarget.style.borderColor = color)}
          onMouseLeave={e => !isRoot && (e.currentTarget.style.borderColor = '#E2E8F0')}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {node.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{node.name}</p>
            <p style={{ fontSize: 11, color: '#94A3B8' }}>{node.id}</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
              <span className={`badge ${node.active ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                {node.active ? 'Active' : 'Inactive'}
              </span>
              {node.level > 0 && <span className="badge badge-gold" style={{ fontSize: 10, padding: '1px 6px' }}>L{node.level}</span>}
            </div>
          </div>
          {hasChildren && (
            <div style={{ color: '#64748B' }}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </div>

        {hasChildren && expanded && (
          <>
            <div style={{ width: 2, height: 24, background: '#E2E8F0' }} />
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              {node.children.map((child, i) => (
                <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 2, height: 24, background: '#E2E8F0' }} />
                  <TreeNode node={child} depth={depth + 1} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const levelCounts = [
  { level: 1, count: 4, active: 3 },
  { level: 2, count: 12, active: 10 },
  { level: 3, count: 38, active: 31 },
  { level: 4, count: 115, active: 89 },
  { level: 5, count: 143, active: 87 },
];

export default function TeamNetwork() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Team Network</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>View your complete downline team structure.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Team', value: 312, color: '#10B981' },
          { label: 'Active Members', value: 220, color: '#22C55E' },
          { label: 'Inactive', value: 92, color: '#F59E0B' },
          { label: 'Direct Referrals', value: 4, color: '#1E3A5F' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stats-card">
            <p style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Satoshi, sans-serif', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 13, color: '#64748B' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Level breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Level-wise Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {levelCounts.map(l => (
            <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="badge badge-gold" style={{ minWidth: 60, justifyContent: 'center' }}>Level {l.level}</span>
              <div style={{ flex: 1, background: '#F1F5F9', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${(l.active / l.count) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981, #34D399)',
                  borderRadius: 100,
                  transition: 'width 0.8s ease-out',
                }} />
              </div>
              <span style={{ fontSize: 13, color: '#64748B', minWidth: 80, textAlign: 'right' }}>{l.active}/{l.count} active</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tree Visualization */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Users size={18} color="#10B981" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Team Structure (Click to expand)</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', minWidth: 700 }}>
          <TreeNode node={TREE} isRoot />
        </div>
      </motion.div>
    </div>
  );
}
