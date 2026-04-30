'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile, changePassword } from '@/actions/users';
import { uploadImage } from '@/actions/upload';

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserData {
  id:        number;
  name:      string;
  email:     string;
  phone:     string | null;
  avatar:    string | null;
  role:      string;
  createdAt: string;
}

interface OrderItem {
  name:     string;
  quantity: number;
  size?:    string;
  color?:   string;
  image:    string | null;
}

interface Order {
  id:          number;
  orderNumber: string;
  status:      string;
  createdAt:   string;
  items:       OrderItem[];
}

interface Donation {
  id:        number;
  amount:    number;
  currency:  string;
  status:    string;
  createdAt: string;
}

interface Props {
  user:        UserData;
  orders:      Order[];
  donations:   Donation[];
  hasPassword: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Tab = 'account' | 'orders' | 'donations' | 'security';

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed:  'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  completed:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
  failed:     'bg-red-50 text-red-700 border-red-200',
  refunded:   'bg-gray-50 text-gray-600 border-gray-200',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProfileView({ user, orders, donations, hasPassword }: Props) {
  const [tab, setTab] = useState<Tab>('account');

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'account',   label: 'Account'   },
    { id: 'orders',    label: 'Orders',    count: orders.length    },
    { id: 'donations', label: 'Donations', count: donations.length },
    { id: 'security',  label: 'Security'  },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* ── Profile header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-5">
        <AvatarSection user={user} />
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-black text-gray-900 text-2xl leading-tight truncate">{user.name}</h1>
          <p className="text-gray-400 text-sm truncate">{user.email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F9E59]/10 text-[#0F9E59] text-xs font-bold capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F9E59]" />
              {user.role}
            </span>
            <span className="text-xs text-gray-400">Member since {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === t.id ? 'bg-[#0F9E59]/10 text-[#0F9E59]' : 'bg-gray-200 text-gray-500'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'account'   && <AccountTab   user={user} />}
          {tab === 'orders'    && <OrdersTab    orders={orders} />}
          {tab === 'donations' && <DonationsTab donations={donations} />}
          {tab === 'security'  && <SecurityTab  userId={user.id} hasPassword={hasPassword} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Avatar section ────────────────────────────────────────────────────────────

function AvatarSection({ user }: { user: UserData }) {
  const [avatar, setAvatar]     = useState(user.avatar);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'avatars');
      const result = await uploadImage(fd, 'avatars');
      if (result?.url) {
        await updateProfile(user.id, { name: user.name, phone: user.phone ?? undefined, avatar: result.url });
        setAvatar(result.url);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#0F9E59] flex items-center justify-center">
        {avatar ? (
          <Image src={avatar} alt={user.name} fill className="object-cover" unoptimized />
        ) : (
          <span className="text-white font-black text-2xl">{initials}</span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
            <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          </div>
        )}
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#0F9E59] border-2 border-white text-white flex items-center justify-center hover:bg-[#0d8a4d] transition-colors disabled:opacity-60"
        title="Change photo"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Account tab ───────────────────────────────────────────────────────────────

function AccountTab({ user }: { user: UserData }) {
  const [name,    setName]    = useState(user.name);
  const [phone,   setPhone]   = useState(user.phone ?? '');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile(user.id, { name: name.trim(), phone: phone.trim() || undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-display font-bold text-gray-900 text-lg mb-6">Account Information</h2>
      <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-md">

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Phone <span className="text-gray-300 font-normal normal-case">(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+250-796-084-144"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="self-start px-8 py-3 rounded-full bg-[#0F9E59] text-white font-bold text-sm hover:bg-[#0d8a4d] disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          {saving ? (
            <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Saving…</>
          ) : saved ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Saved!</>
          ) : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

// ── Orders tab ────────────────────────────────────────────────────────────────

function OrdersTab({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" className="mx-auto mb-4">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <p className="text-gray-500 font-semibold mb-1">No orders yet</p>
        <p className="text-gray-400 text-sm">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-mono font-bold text-gray-900 text-sm">{order.orderNumber}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden relative">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    Qty {item.quantity}{item.size && ` · ${item.size}`}{item.color && ` · ${item.color}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Donations tab ─────────────────────────────────────────────────────────────

function DonationsTab({ donations }: { donations: Donation[] }) {
  if (!donations.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" className="mx-auto mb-4">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <p className="text-gray-500 font-semibold mb-1">No donations yet</p>
        <p className="text-gray-400 text-sm">Your donation history will appear here.</p>
      </div>
    );
  }

  const totalRwf = donations
    .filter((d) => d.status === 'completed' && d.currency === 'RWF')
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      {totalRwf > 0 && (
        <div className="bg-[#0F9E59]/5 border border-[#0F9E59]/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#0F9E59]/10 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F9E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Total Donated</p>
            <p className="text-2xl font-black text-[#0F9E59]">RWF {totalRwf.toLocaleString()}</p>
          </div>
        </div>
      )}

      {donations.map((d) => (
        <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900">{d.currency} {d.amount.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(d.createdAt)}</p>
          </div>
          <StatusBadge status={d.status} />
        </div>
      ))}
    </div>
  );
}

// ── Security tab ──────────────────────────────────────────────────────────────

function SecurityTab({ userId, hasPassword }: { userId: number; hasPassword: boolean }) {
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCurr, setShowCurr] = useState(false);
  const [showNext, setShowNext] = useState(false);

  if (!hasPassword) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </div>
        <p className="font-semibold text-gray-700 mb-1">You signed in with Google</p>
        <p className="text-gray-400 text-sm">Password management is handled by your Google account.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    if (next.length < 8)  { setMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return; }
    setSaving(true);
    setMsg(null);
    const result = await changePassword(userId, current, next);
    setSaving(false);
    if (result.success) {
      setMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrent(''); setNext(''); setConfirm('');
    } else {
      setMsg({ type: 'error', text: result.error ?? 'Something went wrong.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-display font-bold text-gray-900 text-lg mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurr ? 'text' : 'password'}
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
            />
            <button type="button" onClick={() => setShowCurr(!showCurr)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeIcon open={showCurr} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showNext ? 'text' : 'password'}
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
            />
            <button type="button" onClick={() => setShowNext(!showNext)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <EyeIcon open={showNext} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
          />
        </div>

        <AnimatePresence>
          {msg && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm rounded-xl px-4 py-3 border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}
            >
              {msg.text}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-8 py-3 rounded-full bg-[#0F9E59] text-white font-bold text-sm hover:bg-[#0d8a4d] disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          {saving ? <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Updating…</> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
