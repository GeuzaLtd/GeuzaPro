'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEye, HiOutlineX, HiOutlineShoppingCart } from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';

interface Order {
  id: string;
  customer: string;
  email: string;
  item: string;
  qty: number;
  total: string;
  status: string;
  date: string;
  address: string;
}

const ORDERS: Order[] = [
  { id: '#1042', customer: 'Jean-Paul Habimana',    email: 'jp@email.rw',    item: 'Standard Wheelchair',      qty: 1, total: 'RWF 45,000', status: 'Processing', date: 'Mar 4, 2026',  address: 'Kigali, Gasabo' },
  { id: '#1041', customer: 'Aline Uwimana',          email: 'aline@email.rw', item: 'Aluminum Crutches',        qty: 2, total: 'RWF 24,000', status: 'Completed',  date: 'Mar 3, 2026',  address: 'Kigali, Kicukiro' },
  { id: '#1040', customer: 'Eric Nkurunziza',        email: 'eric@email.rw',  item: 'Walking Frame',            qty: 1, total: 'RWF 18,000', status: 'Pending',    date: 'Mar 3, 2026',  address: 'Musanze' },
  { id: '#1039', customer: 'Marie Mukamana',         email: 'marie@email.rw', item: 'Elbow Crutches',          qty: 1, total: 'RWF 9,500',  status: 'Completed',  date: 'Mar 2, 2026',  address: 'Kigali, Nyarugenge' },
  { id: '#1038', customer: 'Patrick Nshimiyimana',   email: 'pat@email.rw',   item: 'Rollator Walker',          qty: 1, total: 'RWF 32,000', status: 'Cancelled',  date: 'Mar 2, 2026',  address: 'Huye' },
  { id: '#1037', customer: 'Claudine Iradukunda',    email: 'clau@email.rw',  item: 'Pediatric Wheelchair',    qty: 1, total: 'RWF 38,000', status: 'Completed',  date: 'Mar 1, 2026',  address: 'Rubavu' },
  { id: '#1036', customer: 'Olivier Ingabire',       email: 'oli@email.rw',   item: 'Quad Cane',               qty: 2, total: 'RWF 15,000', status: 'Processing', date: 'Feb 28, 2026', address: 'Kigali, Gasabo' },
  { id: '#1035', customer: 'Diane Uwase',            email: 'diane@email.rw', item: 'Shower Chair',            qty: 1, total: 'RWF 22,000', status: 'Pending',    date: 'Feb 28, 2026', address: 'Gicumbi' },
  { id: '#1034', customer: 'Samuel Habimana',        email: 'sam@email.rw',   item: 'Transfer Board',          qty: 1, total: 'RWF 14,000', status: 'Completed',  date: 'Feb 27, 2026', address: 'Kigali, Kicukiro' },
  { id: '#1033', customer: 'Josephine Mukankubwayo', email: 'jose@email.rw',  item: 'Standard Wheelchair',     qty: 1, total: 'RWF 45,000', status: 'Refunded',   date: 'Feb 26, 2026', address: 'Nyagatare' },
];

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold text-[#0F9E59] uppercase tracking-widest mb-0.5">Order Details</p>
            <h3 className="font-display font-black text-gray-900 text-xl">{order.id}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <HiOutlineX size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Total</p>
              <p className="font-display font-black text-gray-900 text-xl">{order.total}</p>
            </div>
          </div>

          {[
            { label: 'Customer',    value: order.customer },
            { label: 'Email',       value: order.email },
            { label: 'Address',     value: order.address },
            { label: 'Item',        value: order.item },
            { label: 'Quantity',    value: String(order.qty) },
            { label: 'Order Date',  value: order.date },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm text-gray-700 font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <select className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all bg-white">
            {['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'].map((s) => (
              <option key={s} selected={s === order.status}>{s}</option>
            ))}
          </select>
          <button onClick={onClose} className="px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all">
            Update
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrdersPage() {
  const [selected, setSelected] = useState<Order | null>(null);

  const completed  = ORDERS.filter((o) => o.status === 'Completed').length;
  const pending    = ORDERS.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const cancelled  = ORDERS.filter((o) => o.status === 'Cancelled').length;

  const columns: Column<Order>[] = [
    { key: 'id',       label: 'Order ID', render: (o) => <span className="font-semibold text-[#0F9E59] text-sm">{o.id}</span> },
    { key: 'customer', label: 'Customer', sortable: true, render: (o) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{o.customer}</p>
          <p className="text-xs text-gray-400">{o.email}</p>
        </div>
      ),
    },
    { key: 'item',    label: 'Item',   render: (o) => <span className="text-gray-600 text-sm">{o.item}</span> },
    { key: 'qty',     label: 'Qty',    render: (o) => <span className="text-gray-600 text-sm">{o.qty}</span> },
    { key: 'total',   label: 'Total',  sortable: true, render: (o) => <span className="font-semibold text-gray-800 text-sm">{o.total}</span> },
    { key: 'status',  label: 'Status', render: (o) => <StatusBadge status={o.status} /> },
    { key: 'date',    label: 'Date',   sortable: true, render: (o) => <span className="text-gray-400 text-xs whitespace-nowrap">{o.date}</span> },
  ];

  return (
    <>
      <DashboardHeader title="Orders" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Orders"
          description="Track and manage customer orders"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Orders' }]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Orders',  value: ORDERS.length, color: '#0F9E59' },
            { label: 'Completed',     value: completed,     color: '#0F9E59' },
            { label: 'In Progress',   value: pending,       color: '#3b82f6' },
            { label: 'Cancelled',     value: cancelled,     color: '#ef4444' },
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
          data={ORDERS}
          searchKeys={['customer', 'item', 'id']}
          pageSize={8}
          actions={(o) => (
            <button onClick={() => setSelected(o)}
              className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all" title="View Details">
              <HiOutlineEye size={14} />
            </button>
          )}
        />
      </main>

      <AnimatePresence>
        {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
