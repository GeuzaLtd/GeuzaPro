'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineMail } from 'react-icons/hi';
import { DashboardHeader, PageHeader } from '@/components/dashboard';
import { deleteWaitlistEntry } from '@/actions/waitlist';

export interface WaitlistRow {
  id:          number;
  email:       string;
  name:        string | null;
  productId:   number;
  productName: string;
  status:      string;
  date:        string;
}

export default function WaitlistView({ initialData }: { initialData: WaitlistRow[] }) {
  const router  = useRouter();
  const [rows, setRows] = useState<WaitlistRow[]>(initialData);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await deleteWaitlistEntry(id);
    setRows((r) => r.filter((x) => x.id !== id));
    router.refresh();
    setDeleting(null);
  };

  const byProduct = rows.reduce<Record<string, WaitlistRow[]>>((acc, r) => {
    const key = `${r.productId}::${r.productName}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <>
      <DashboardHeader title="Waitlist" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Waitlist"
          description="Customers waiting to be notified when out-of-stock products become available"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Waitlist' }]}
        />

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total subscribers', value: rows.length,                    color: '#0F9E59' },
            { label: 'Products with queue', value: Object.keys(byProduct).length, color: '#FF7900' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-16 text-center">
            <HiOutlineMail size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No waitlist entries yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(byProduct).map(([key, entries], gi) => {
              const productName = entries[0].productName;
              const status      = entries[0].status;
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Product header */}
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-gray-900 text-base">{productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{entries.length} subscriber{entries.length !== 1 ? 's' : ''}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${
                      status === 'out_stock' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {status === 'out_stock' ? 'Out of Stock' : status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Subscriber rows */}
                  <div className="divide-y divide-gray-50">
                    {entries.map((row, i) => (
                      <motion.div key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="px-6 py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                            {(row.name ?? row.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            {row.name && <p className="text-sm font-medium text-gray-900 truncate">{row.name}</p>}
                            <p className="text-xs text-gray-400 truncate">{row.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-gray-400 whitespace-nowrap">{row.date}</span>
                          <button
                            onClick={() => handleDelete(row.id)}
                            disabled={deleting === row.id}
                            className="w-8 h-8 rounded-full border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-all disabled:opacity-40"
                            aria-label="Remove from waitlist"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
