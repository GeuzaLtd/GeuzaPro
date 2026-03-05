'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEye, HiOutlineX, HiOutlineHeart } from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';

interface Donation {
  id: string;
  donor: string;
  email: string;
  amount: string;
  campaign: string;
  method: string;
  status: string;
  date: string;
  message?: string;
}

const DONATIONS: Donation[] = [
  { id: 'D-101', donor: 'Aline Uwimana',          email: 'aline@email.rw',   amount: 'RWF 50,000',  campaign: 'Wheelchair Fund',   method: 'MoMo',  status: 'Confirmed', date: 'Mar 3, 2026',  message: 'Keep up the great work!' },
  { id: 'D-100', donor: 'Marie Mukamana',          email: 'marie@email.rw',   amount: 'RWF 100,000', campaign: 'General',           method: 'Bank',  status: 'Confirmed', date: 'Mar 2, 2026'  },
  { id: 'D-099', donor: 'Anonymous',               email: '—',                amount: 'RWF 25,000',  campaign: 'Crutches Drive',    method: 'MoMo',  status: 'Confirmed', date: 'Feb 28, 2026' },
  { id: 'D-098', donor: 'Diane Uwase',             email: 'diane@email.rw',   amount: 'RWF 200,000', campaign: 'General',           method: 'Bank',  status: 'Pending',   date: 'Feb 27, 2026' },
  { id: 'D-097', donor: 'Patrick Nshimiyimana',    email: 'pat@email.rw',     amount: 'RWF 15,000',  campaign: 'Wheelchair Fund',   method: 'Card',  status: 'Failed',    date: 'Feb 25, 2026', message: 'Payment gateway issue.' },
  { id: 'D-096', donor: 'Jean-Paul Habimana',      email: 'jp@email.rw',      amount: 'RWF 30,000',  campaign: 'Crutches Drive',    method: 'MoMo',  status: 'Confirmed', date: 'Feb 22, 2026' },
  { id: 'D-095', donor: 'Vestine Umuhoza',         email: 'vestine@email.rw', amount: 'RWF 75,000',  campaign: 'General',           method: 'Bank',  status: 'Confirmed', date: 'Feb 20, 2026', message: 'Glad to support this mission.' },
  { id: 'D-094', donor: 'Samuel Habimana',         email: 'sam@email.rw',     amount: 'RWF 10,000',  campaign: 'Walking Aid Drive', method: 'MoMo',  status: 'Confirmed', date: 'Feb 18, 2026' },
  { id: 'D-093', donor: 'Josephine Mukankubwayo',  email: 'jose@email.rw',    amount: 'RWF 45,000',  campaign: 'General',           method: 'Card',  status: 'Confirmed', date: 'Feb 15, 2026' },
  { id: 'D-092', donor: 'Anonymous',               email: '—',                amount: 'RWF 20,000',  campaign: 'Wheelchair Fund',   method: 'MoMo',  status: 'Confirmed', date: 'Feb 12, 2026' },
  { id: 'D-091', donor: 'Eric Nkurunziza',         email: 'eric@email.rw',    amount: 'RWF 5,000',   campaign: 'Crutches Drive',    method: 'MoMo',  status: 'Refunded',  date: 'Feb 10, 2026' },
];

function DonationDetailModal({ donation, onClose }: { donation: Donation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold text-[#FF7900] uppercase tracking-widest mb-0.5">Donation Receipt</p>
            <h3 className="font-display font-black text-gray-900 text-xl">{donation.id}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <HiOutlineX size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="bg-gradient-to-br from-[#0F9E59]/8 to-[#FF7900]/5 rounded-xl p-5 text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-[#FF7900]/10 flex items-center justify-center mx-auto mb-3">
              <HiOutlineHeart size={22} className="text-[#FF7900]" />
            </div>
            <p className="font-display font-black text-gray-900 text-3xl">{donation.amount}</p>
            <StatusBadge status={donation.status} />
          </div>

          {[
            { label: 'Donor',    value: donation.donor },
            { label: 'Email',    value: donation.email },
            { label: 'Campaign', value: donation.campaign },
            { label: 'Method',   value: donation.method },
            { label: 'Date',     value: donation.date },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm text-gray-700 font-medium">{value}</p>
            </div>
          ))}

          {donation.message && (
            <div className="mt-4 bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</p>
              <p className="text-sm text-gray-600 italic">&ldquo;{donation.message}&rdquo;</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DonationsPage() {
  const [selected, setSelected] = useState<Donation | null>(null);

  const confirmed = DONATIONS.filter((d) => d.status === 'Confirmed').length;
  const pending   = DONATIONS.filter((d) => d.status === 'Pending').length;
  const totalRwf  = DONATIONS
    .filter((d) => d.status === 'Confirmed')
    .reduce((sum, d) => {
      const n = parseInt(d.amount.replace(/[^0-9]/g, '')) || 0;
      return sum + n;
    }, 0);

  const columns: Column<Donation>[] = [
    { key: 'id',     label: 'ID',     render: (d) => <span className="font-semibold text-[#FF7900] text-sm">{d.id}</span> },
    { key: 'donor',  label: 'Donor',  sortable: true, render: (d) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{d.donor}</p>
          {d.email !== '—' && <p className="text-xs text-gray-400">{d.email}</p>}
        </div>
      ),
    },
    { key: 'amount',   label: 'Amount',   sortable: true, render: (d) => <span className="font-semibold text-gray-800 text-sm">{d.amount}</span> },
    { key: 'campaign', label: 'Campaign', sortable: true, render: (d) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{d.campaign}</span>
      ),
    },
    { key: 'method',  label: 'Method',  render: (d) => <span className="text-gray-500 text-sm">{d.method}</span> },
    { key: 'status',  label: 'Status',  render: (d) => <StatusBadge status={d.status} /> },
    { key: 'date',    label: 'Date',    sortable: true, render: (d) => <span className="text-gray-400 text-xs whitespace-nowrap">{d.date}</span> },
  ];

  return (
    <>
      <DashboardHeader title="Donations" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Donations"
          description="Track all donations and campaigns"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Donations' }]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Donations', value: DONATIONS.length, color: '#FF7900' },
            { label: 'Confirmed',       value: confirmed,        color: '#0F9E59' },
            { label: 'Pending',         value: pending,          color: '#eab308' },
            { label: 'Total Collected', value: `RWF ${(totalRwf / 1000).toFixed(0)}K`, color: '#FF7900' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <AdminTable
          columns={columns}
          data={DONATIONS}
          searchKeys={['donor', 'campaign', 'id']}
          pageSize={8}
          actions={(d) => (
            <button onClick={() => setSelected(d)}
              className="w-8 h-8 rounded-lg bg-[#FF7900]/10 text-[#FF7900] hover:bg-[#FF7900] hover:text-white flex items-center justify-center transition-all" title="View">
              <HiOutlineEye size={14} />
            </button>
          )}
        />
      </main>

      <AnimatePresence>
        {selected && <DonationDetailModal donation={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
