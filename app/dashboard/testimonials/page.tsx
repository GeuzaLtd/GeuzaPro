'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlinePhotograph,
  HiStar,
  HiOutlineStar,
} from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  organization: string;
  quote: string;
  rating: number;
  status: string;
  date: string;
  featured: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 1, name: 'Jean-Paul Habimana',    role: 'Wheelchair User',        organization: 'Individual',         quote: 'The wheelchair I received from Geuza has completely transformed my life. I can now move freely and attend school without any help.',               rating: 5, status: 'Published', date: 'Jan 2026', featured: true  },
  { id: 2, name: 'Claudine Iradukunda',   role: 'Community Leader',       organization: 'Kacyiru Village',    quote: 'Geuza has been a blessing to our community. Three families in our village now have the devices they need to live independently.',                    rating: 5, status: 'Published', date: 'Dec 2025', featured: true  },
  { id: 3, name: 'Dr. Alice Niyomugabo',  role: 'Medical Officer',        organization: 'Kigali Health Center', quote: 'We have partnered with Geuza for device distribution. The quality is excellent and the team is very professional.',                            rating: 5, status: 'Published', date: 'Nov 2025', featured: false },
  { id: 4, name: 'Patrick Nshimiyimana', role: 'Parent',                  organization: 'Individual',         quote: 'My son received a pediatric wheelchair and for the first time he can play with other children. We are so grateful for this initiative.',           rating: 5, status: 'Published', date: 'Oct 2025', featured: true  },
  { id: 5, name: 'Amahoro Foundation',    role: 'Executive Director',     organization: 'Amahoro Foundation', quote: 'Our partnership with Geuza has allowed us to serve over 50 families with disabilities in Musanze. Truly impactful work.',                        rating: 4, status: 'Draft',     date: 'Oct 2025', featured: false },
  { id: 6, name: 'Vestine Umuhoza',       role: 'Crutches User',          organization: 'Individual',         quote: 'After my accident, I thought life would never be the same. Geuza provided me with crutches and helped me get back on my feet.',                   rating: 5, status: 'Published', date: 'Sep 2025', featured: false },
  { id: 7, name: 'Samuel Bizimana',       role: 'District Administrator', organization: 'Rubavu District',    quote: 'The district-wide program with Geuza reached over 200 beneficiaries. We look forward to expanding this partnership.',                             rating: 5, status: 'Published', date: 'Aug 2025', featured: false },
];

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          {(hover || rating) >= i
            ? <HiStar size={18} className="text-amber-400" />
            : <HiOutlineStar size={18} className="text-gray-300" />}
        </button>
      ))}
    </div>
  );
}

function TestimonialModal({
  testimonial,
  onClose,
  onSave,
}: {
  testimonial: Partial<Testimonial> | null;
  onClose: () => void;
  onSave: (t: Testimonial) => void;
}) {
  const isNew = !testimonial?.id;
  const [form, setForm] = useState({
    name:         testimonial?.name         ?? '',
    role:         testimonial?.role         ?? '',
    organization: testimonial?.organization ?? '',
    quote:        testimonial?.quote        ?? '',
    rating:       testimonial?.rating       ?? 5,
    status:       testimonial?.status       ?? 'Draft',
    featured:     testimonial?.featured     ?? false,
    date:         testimonial?.date         ?? new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1 mb-1">
              <HiStar size={12} className="text-amber-400" />
              <span className="text-amber-600 text-xs font-bold tracking-widest uppercase">{isNew ? 'New' : 'Edit'} Testimonial</span>
            </div>
            <h3 className="font-display font-black text-gray-900 text-xl">{isNew ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <HiOutlineX size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Avatar placeholder + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-amber-300 hover:text-amber-400 transition-all cursor-pointer flex-shrink-0">
              <HiOutlinePhotograph size={20} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Jean-Paul Habimana"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role / Title</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Wheelchair User"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Organization</label>
              <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="e.g. Individual"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rating</label>
            <StarRating rating={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Testimonial Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
              placeholder="What did they say about Geuza?..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all resize-none" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
              <div className="flex gap-3">
                {['Draft', 'Published'].map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.status === s ? 'bg-[#0F9E59] text-white border-[#0F9E59]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className={`w-10 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-amber-400' : 'bg-gray-200'}`}
                onClick={() => setForm({ ...form, featured: !form.featured })}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.featured ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-sm font-semibold text-gray-600">Featured</span>
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={() => onSave({ id: testimonial?.id ?? Date.now(), ...form })}
            className="px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20">
            {isNew ? 'Add Testimonial' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [items, setItems]         = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [modal, setModal]         = useState<Partial<Testimonial> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const openCreate = () => { setModal({}); setShowModal(true); };
  const openEdit   = (t: Testimonial) => { setModal(t); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setTimeout(() => setModal(null), 200); };

  const handleSave = (t: Testimonial) => {
    setItems((prev) =>
      prev.find((x) => x.id === t.id) ? prev.map((x) => (x.id === t.id ? t : x)) : [t, ...prev]
    );
    closeModal();
  };

  const published = items.filter((t) => t.status === 'Published').length;
  const featured  = items.filter((t) => t.featured).length;
  const avgRating = items.length ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1) : '—';

  const columns: Column<Testimonial>[] = [
    { key: 'name', label: 'Person', sortable: true, render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
            <p className="text-xs text-gray-400">{t.role} · {t.organization}</p>
          </div>
        </div>
      ),
    },
    { key: 'quote', label: 'Quote', render: (t) => (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs italic">&ldquo;{t.quote}&rdquo;</p>
      ),
    },
    { key: 'rating', label: 'Rating', sortable: true, render: (t) => <StarRating rating={t.rating} /> },
    { key: 'featured', label: 'Featured', render: (t) => (
        t.featured
          ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full"><HiStar size={11} />Featured</span>
          : <span className="text-xs text-gray-300">—</span>
      ),
    },
    { key: 'status', label: 'Status', render: (t) => <StatusBadge status={t.status} /> },
    { key: 'date',   label: 'Date',   sortable: true, render: (t) => <span className="text-gray-400 text-xs">{t.date}</span> },
  ];

  return (
    <>
      <DashboardHeader title="Testimonials" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Testimonials"
          description="Manage customer stories and reviews"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Testimonials' }]}
          action={
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20">
              <HiOutlinePlus size={16} /> Add Testimonial
            </button>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',      value: items.length, color: '#0F9E59' },
            { label: 'Published',  value: published,    color: '#0F9E59' },
            { label: 'Featured',   value: featured,     color: '#FF7900' },
            { label: 'Avg Rating', value: `${avgRating}★`, color: '#f59e0b' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <AdminTable columns={columns} data={items} searchKeys={['name', 'role', 'organization']} pageSize={7}
          actions={(t) => (
            <>
              <button onClick={() => openEdit(t)}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all" title="Edit">
                <HiOutlinePencil size={14} />
              </button>
              <button onClick={() => setDeleteId(t.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all" title="Delete">
                <HiOutlineTrash size={14} />
              </button>
            </>
          )}
        />
      </main>

      <AnimatePresence>
        {showModal && modal !== null && <TestimonialModal testimonial={modal} onClose={closeModal} onSave={handleSave} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full z-10 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <HiOutlineTrash size={24} className="text-red-500" />
              </div>
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Delete Testimonial?</h3>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={() => { setItems((t) => t.filter((x) => x.id !== deleteId)); setDeleteId(null); }}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
