import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, X, Send, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDate';
import { useAuthStore } from '@/store/authStore';

const mockTickets = [
  {
    id: 'TKT001', subject: 'Withdrawal not processed', category: 'Withdrawal', priority: 'High',
    status: 'In Progress', created: '2025-05-24',
    messages: [
      { sender: 'user', text: 'My withdrawal request from May 22 has not been processed yet.', time: '2025-05-24T10:00:00' },
      { sender: 'admin', text: 'Thank you for reaching out. We are looking into your request and will update you within 24 hours.', time: '2025-05-24T14:30:00' },
    ]
  },
  {
    id: 'TKT002', subject: 'E-Pin not working', category: 'E-Pin', priority: 'Medium',
    status: 'Resolved', created: '2025-05-10',
    messages: [
      { sender: 'user', text: 'The E-Pin I received shows as invalid.', time: '2025-05-10T09:00:00' },
      { sender: 'admin', text: 'We have reset the pin. Please try again with the new code sent to your email.', time: '2025-05-10T11:00:00' },
    ]
  },
];

function NewTicketModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ subject: '', category: 'General', priority: 'Medium', desc: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.desc) { toast.error('Fill all required fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onCreate({ ...form, id: `TKT${Date.now()}`, status: 'Open', created: new Date().toISOString().split('T')[0], messages: [{ sender: 'user', text: form.desc, time: new Date().toISOString() }] });
    toast.success('Support ticket created!');
    onClose();
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal-card" style={{ padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Create Support Ticket</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="input-label">Subject *</label>
            <input className="input" placeholder="Brief description of the issue" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="input-label">Category</label>
              <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['General', 'Withdrawal', 'E-Pin', 'Income', 'Technical', 'Account'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Priority</label>
              <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="input-label">Description *</label>
            <textarea className="input" rows={4} placeholder="Describe your issue in detail..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function TicketDetail({ ticket, user, onClose }) {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState(ticket.messages);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages(m => [...m, { sender: 'user', text: reply, time: new Date().toISOString() }]);
    setReply('');
    toast.success('Reply sent!');
  };

  const statusColors = { Open: 'badge-blue', 'In Progress': 'badge-gold', Resolved: 'badge-green', Closed: 'badge-gray' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="modal-card" style={{ padding: 0, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Satoshi, sans-serif', fontWeight: 700 }}>{ticket.id}</span>
              <span className={`badge ${statusColors[ticket.status]}`}>{ticket.status}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{ticket.subject}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B" /></button>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px',
                background: msg.sender === 'user' ? '#10B981' : '#F8FAFC',
                color: msg.sender === 'user' ? '#fff' : '#0F172A',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: 14, lineHeight: 1.6,
                border: msg.sender !== 'user' ? '1px solid #E2E8F0' : 'none',
              }}>
                {msg.sender === 'admin' && <p style={{ fontSize: 11, color: '#64748B', fontWeight: 700, marginBottom: 4 }}>Support Team</p>}
                <p>{msg.text}</p>
                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
        {ticket.status !== 'Resolved' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 10 }}>
            <input className="input" placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendReply()} />
            <button className="btn btn-primary" onClick={sendReply}><Send size={16} /></button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function SupportTickets() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState(mockTickets);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState(null);

  const statusColors = { Open: 'badge-blue', 'In Progress': 'badge-gold', Resolved: 'badge-green', Closed: 'badge-gray' };
  const priorityColors = { Low: 'badge-gray', Medium: 'badge-blue', High: 'badge-gold', Urgent: 'badge-red' };

  return (
    <div style={{ maxWidth: 800 }}>
      <AnimatePresence>
        {showNew && <NewTicketModal onClose={() => setShowNew(false)} onCreate={t => setTickets(ts => [t, ...ts])} />}
        {selected && <TicketDetail ticket={selected} user={user} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Support Tickets</h2>
          <p style={{ color: '#64748B', fontSize: 14 }}>Get help from our support team.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)} style={{ gap: 8 }}>
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {tickets.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>
            <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: 15 }}>No tickets yet. Create one to get help!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Ticket ID</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 12, color: '#64748B' }}>{ticket.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13, maxWidth: 180 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{ticket.category}</td>
                  <td><span className={`badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span></td>
                  <td><span className={`badge ${statusColors[ticket.status]}`}>{ticket.status}</span></td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{formatDate(ticket.created)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(ticket)} style={{ gap: 4 }}>
                      View <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
