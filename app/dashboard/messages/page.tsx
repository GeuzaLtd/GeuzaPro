'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineX,
  HiOutlineReply,
  HiOutlineTrash,
  HiOutlineMail,
  HiOutlineMailOpen,
} from 'react-icons/hi';
import { DashboardHeader, StatusBadge, PageHeader } from '@/components/dashboard';

interface Message {
  id: number;
  sender: string;
  email: string;
  organization?: string;
  subject: string;
  body: string;
  status: string;
  date: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1,  sender: 'Jean-Paul Habimana',    email: 'jp@email.rw',       organization: 'Individual',       subject: 'Wheelchair donation inquiry',          body: 'Hello, I would like to donate 2 wheelchairs from my organization. Can you guide me on the process?',          status: 'Unread',   date: 'Mar 4, 2026'  },
  { id: 2,  sender: 'Hope Foundation',        email: 'info@hope.rw',      organization: 'NGO',              subject: 'Partnership proposal',                body: 'We are an NGO working with disabled youth in Kigali. We are interested in partnering with Geuza to expand our reach.',       status: 'Read',     date: 'Mar 3, 2026'  },
  { id: 3,  sender: 'Aline Uwimana',          email: 'aline@email.rw',    organization: 'Individual',       subject: 'Product availability question',       body: 'Are pediatric wheelchairs currently in stock? I need one urgently for my child.',                           status: 'Replied',  date: 'Mar 2, 2026'  },
  { id: 4,  sender: 'Rwanda MOH',             email: 'moh@gov.rw',        organization: 'Government',       subject: 'Bulk order inquiry',                  body: 'The Ministry of Health would like to discuss a bulk procurement of assistive devices for hospitals.',      status: 'Read',     date: 'Mar 1, 2026'  },
  { id: 5,  sender: 'Eric Nkurunziza',        email: 'eric@email.rw',     organization: 'Individual',       subject: 'Technical support needed',            body: 'My rollator walker has a broken wheel. Can I bring it in for repair or replacement?',                        status: 'Unread',   date: 'Feb 28, 2026' },
  { id: 6,  sender: 'Kigali Tech Hub',        email: 'info@kigalit.rw',   organization: 'Corporate',        subject: 'CSR donation opportunity',            body: 'Our company is looking for CSR opportunities. We would like to donate assistive devices worth RWF 500,000.', status: 'Replied',  date: 'Feb 27, 2026' },
  { id: 7,  sender: 'Marie Mukamana',         email: 'marie@email.rw',    organization: 'Individual',       subject: 'Feedback on product',                body: 'I received my wheelchair last week and I am very happy with the quality. Thank you for your service!',        status: 'Read',     date: 'Feb 25, 2026' },
  { id: 8,  sender: 'Rubavu District',        email: 'admin@rubavu.rw',   organization: 'Government',       subject: 'District-wide assistive device drive', body: 'We would like to partner for a district-wide assistive device distribution program in March.',            status: 'Unread',   date: 'Feb 24, 2026' },
];

function MessageDetail({ message, onClose, onMarkRead, onDelete }: {
  message: Message;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
    setReply('');
    onMarkRead(message.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-gray-900 text-lg leading-tight">{message.subject}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0F9E59] to-[#1bc870] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {message.sender[0]}
              </div>
              <span className="text-sm font-medium text-gray-700">{message.sender}</span>
              <span className="text-xs text-gray-400">&lt;{message.email}&gt;</span>
              {message.organization && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{message.organization}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <span className="text-xs text-gray-400">{message.date}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
              <HiOutlineX size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">
          <div className="bg-gray-50 rounded-xl p-5 mb-5">
            <p className="text-sm text-gray-700 leading-relaxed">{message.body}</p>
          </div>

          {/* Reply box */}
          {sent ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0F9E59]/10 rounded-xl p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#0F9E59] flex items-center justify-center text-white flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0F9E59]">Reply sent successfully!</p>
                <p className="text-xs text-gray-400 mt-0.5">The sender will receive your reply at {message.email}</p>
              </div>
            </motion.div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reply</label>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)}
                placeholder={`Reply to ${message.sender}...`}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all resize-none" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button onClick={() => { onDelete(message.id); onClose(); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-100 text-sm font-medium text-red-400 hover:bg-red-50 transition-all">
            <HiOutlineTrash size={14} /> Delete
          </button>
          {!sent && (
            <button onClick={handleSend} disabled={sending || !reply.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all disabled:opacity-50">
              {sending ? (
                <motion.span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              ) : <HiOutlineReply size={14} />}
              Send Reply
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages]   = useState<Message[]>(INITIAL_MESSAGES);
  const [selected, setSelected]   = useState<Message | null>(null);
  const [filter, setFilter]       = useState<'All' | 'Unread' | 'Read' | 'Replied'>('All');

  const markRead   = (id: number) => setMessages((m) => m.map((x) => x.id === id ? { ...x, status: 'Replied' } : x));
  const deleteMsg  = (id: number) => setMessages((m) => m.filter((x) => x.id !== id));
  const openMsg    = (msg: Message) => {
    if (msg.status === 'Unread') setMessages((m) => m.map((x) => x.id === msg.id ? { ...x, status: 'Read' } : x));
    setSelected(msg);
  };

  const filtered = filter === 'All' ? messages : messages.filter((m) => m.status === filter);
  const unread   = messages.filter((m) => m.status === 'Unread').length;

  return (
    <>
      <DashboardHeader title="Messages" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Messages"
          description="Contact form submissions and inquiries"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Messages' }]}
        />

        {/* Summary + filter tabs */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="grid grid-cols-4 gap-4 flex-1">
            {[
              { label: 'Total',    value: messages.length,  color: '#0F9E59' },
              { label: 'Unread',   value: unread,           color: '#FF7900' },
              { label: 'Read',     value: messages.filter((m) => m.status === 'Read').length,    color: '#3b82f6' },
              { label: 'Replied',  value: messages.filter((m) => m.status === 'Replied').length, color: '#0F9E59' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-4">
          {(['All', 'Unread', 'Read', 'Replied'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-[#0F9E59] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {f} {f === 'Unread' && unread > 0 && `(${unread})`}
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No messages in this category.</div>
          ) : (
            filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openMsg(msg)}
                className={`px-6 py-4 flex items-start gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer ${msg.status === 'Unread' ? 'bg-[#0F9E59]/[0.02]' : ''}`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.status === 'Unread' ? 'bg-[#FF7900]/10 text-[#FF7900]' : msg.status === 'Replied' ? 'bg-[#0F9E59]/10 text-[#0F9E59]' : 'bg-gray-100 text-gray-400'}`}>
                  {msg.status === 'Unread' ? <HiOutlineMail size={16} /> : <HiOutlineMailOpen size={16} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm leading-none ${msg.status === 'Unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {msg.sender}
                        </p>
                        {msg.organization && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{msg.organization}</span>
                        )}
                        {msg.status === 'Unread' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF7900] flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-sm mt-0.5 ${msg.status === 'Unread' ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.body}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">{msg.date}</span>
                      <StatusBadge status={msg.status} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <AnimatePresence>
        {selected && (
          <MessageDetail
            message={selected}
            onClose={() => setSelected(null)}
            onMarkRead={markRead}
            onDelete={(id) => { deleteMsg(id); setSelected(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
