import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Plus, Trash2, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultFAQs = [
  { q: 'What is RS Trading?', a: 'RS Trading is a premium digital business network platform...' },
  { q: 'How do I register?', a: 'Registration requires a valid Sponsor ID...' },
  { q: 'What is an E-Pin?', a: 'An E-Pin is a unique activation code...' },
];

const defaultAnnouncements = [
  { id: 1, title: 'System Maintenance', text: 'Planned maintenance on June 1, 2025 from 2-4 AM IST.', active: true },
  { id: 2, title: 'New Feature: PDF Statements', text: 'You can now download income statements as PDF!', active: false },
];

export default function CMSManagement() {
  const [hero, setHero] = useState({
    badge: "India's Premium Business Network",
    heading: 'Grow Your Business. Build Your Future.',
    subtext: 'Join RS Trading\'s structured referral income platform...',
  });
  const [faqs, setFaqs] = useState(defaultFAQs);
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [editFaq, setEditFaq] = useState(null);
  const [newAnn, setNewAnn] = useState({ title: '', text: '' });

  const saveHero = () => toast.success('Hero content saved!');
  const saveFaq = () => { setFaqs(f => f.map(faq => editFaq?.q === faq.q ? editFaq : faq)); setEditFaq(null); toast.success('FAQ updated!'); };
  const deleteFaq = (q) => { setFaqs(f => f.filter(faq => faq.q !== q)); toast.success('FAQ deleted'); };
  const addFaq = () => setFaqs(f => [...f, { q: 'New Question', a: 'New Answer' }]);
  const toggleAnn = (id) => { setAnnouncements(a => a.map(ann => ann.id === id ? { ...ann, active: !ann.active } : ann)); };
  const addAnn = () => {
    if (!newAnn.title || !newAnn.text) { toast.error('Fill title and text'); return; }
    setAnnouncements(a => [...a, { id: Date.now(), ...newAnn, active: true }]);
    setNewAnn({ title: '', text: '' });
    toast.success('Announcement created!');
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>CMS Management</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>Edit landing page content without touching code.</p>
      </div>

      {/* Hero Section Editor */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Hero Section Content</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="input-label">Badge Text</label>
            <input className="input" value={hero.badge} onChange={e => setHero(h => ({ ...h, badge: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Main Heading</label>
            <input className="input" value={hero.heading} onChange={e => setHero(h => ({ ...h, heading: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Sub Text</label>
            <textarea className="input" rows={2} value={hero.subtext} onChange={e => setHero(h => ({ ...h, subtext: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', gap: 6 }} onClick={saveHero}>
            <Save size={14} /> Save Hero Content
          </button>
        </div>
      </motion.div>

      {/* FAQ Editor */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>FAQ Items</h3>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }} onClick={addFaq}><Plus size={14} /> Add FAQ</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              {editFaq?.q === faq.q ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input className="input" value={editFaq.q} onChange={e => setEditFaq(f => ({ ...f, q: e.target.value }))} placeholder="Question" style={{ fontSize: 13 }} />
                  <textarea className="input" rows={2} value={editFaq.a} onChange={e => setEditFaq(f => ({ ...f, a: e.target.value }))} placeholder="Answer" style={{ fontSize: 13, resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={saveFaq} style={{ gap: 4 }}><Save size={13} /> Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditFaq(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Q: {faq.q}</p>
                    <p style={{ fontSize: 12, color: '#64748B' }}>A: {faq.a.slice(0, 80)}...</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} onClick={() => setEditFaq(faq)}><Edit3 size={13} /></button>
                    <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', padding: '4px 8px' }} onClick={() => deleteFaq(faq.q)}><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Announcements */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Announcement Banners</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {announcements.map(ann => (
            <div key={ann.id} style={{
              padding: '14px 16px', borderRadius: 10,
              background: ann.active ? 'rgba(16,185,129,0.05)' : '#F8FAFC',
              border: `1px solid ${ann.active ? 'rgba(16,185,129,0.2)' : '#E2E8F0'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{ann.title}</p>
                <p style={{ fontSize: 12, color: '#64748B' }}>{ann.text}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span className={`badge ${ann.active ? 'badge-green' : 'badge-gray'}`}>{ann.active ? 'Active' : 'Hidden'}</span>
                <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} onClick={() => toggleAnn(ann.id)}>
                  {ann.active ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Create New Announcement</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label className="input-label">Title</label>
              <input className="input" placeholder="Short title" value={newAnn.title} onChange={e => setNewAnn(n => ({ ...n, title: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Message</label>
              <input className="input" placeholder="Announcement text" value={newAnn.text} onChange={e => setNewAnn(n => ({ ...n, text: e.target.value }))} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={addAnn} style={{ gap: 4 }}><Plus size={14} /> Add</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
