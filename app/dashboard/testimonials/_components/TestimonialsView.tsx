'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/actions/testimonials';

export interface TestimonialRow {
  id: number;
  name: string;
  role: string | null;
  organization: string | null;
  quote: string;
  rating: number;
  status: string;
  date: string;
  featured: boolean;
  avatar: string | null;
}

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
  testimonial: Partial<TestimonialRow> | null;
  onClose: () => void;
  onSave: (t: { name: string; role: string; organization: string; quote: string; rating: number; status: string; featured: boolean; isNew: boolean; id?: number }) => Promise<void>;
}) {
  const isNew = !testimonial?.id;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:         testimonial?.name         ?? '',
    role:         testimonial?.role         ?? '',
    organization: testimonial?.organization ?? '',
    quote:        testimonial?.quote        ?? '',
    rating:       testimonial?.rating       ?? 5,
    status:       testimonial?.status       ?? 'Draft',
    featured:     testimonial?.featured     ?? false,
  });

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...form, isNew, id: testimonial?.id });
    setSaving(false);
  };

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
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60">
            {saving ? 'Saving…' : isNew ? 'Add Testimonial' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TestimonialsView({ initialData }: { initialData: TestimonialRow[] }) {
  const router = useRouter();
  const [items, setItems]         = useState<TestimonialRow[]>(initialData);
  const [modal, setModal]         = useState<Partial<TestimonialRow> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const openCreate = () => { setModal({}); setShowModal(true); };
  const openEdit   = (t: TestimonialRow) => { setModal(t); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setTimeout(() => setModal(null), 200); };

  const handleSave = async (data: { name: string; role: string; organization: string; quote: string; rating: number; status: string; featured: boolean; isNew: boolean; id?: number }) => {
    const isVisible = data.status === 'Published';
    if (data.isNew) {
      const created = await createTestimonial({
        name: data.name,
        role: data.role || undefined,
        company: data.organization || undefined,
        quote: data.quote,
        rating: data.rating,
      });
      setItems((prev) => [
        {
          id: created.id,
          name: created.name,
          role: created.role ?? null,
          organization: data.organization || null,
          quote: created.quote,
          rating: created.rating ?? 5,
          status: data.status,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          featured: data.featured,
          avatar: null,
        },
        ...prev,
      ]);
    } else if (data.id !== undefined) {
      await updateTestimonial(data.id, {
        name: data.name,
        role: data.role || undefined,
        company: data.organization || undefined,
        quote: data.quote,
        rating: data.rating,
        isVisible,
      });
      setItems((prev) =>
        prev.map((t) =>
          t.id === data.id
            ? { ...t, name: data.name, role: data.role || null, organization: data.organization || null, quote: data.quote, rating: data.rating, status: data.status, featured: data.featured }
            : t
        )
      );
    }
    closeModal();
    router.refresh();
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteTestimonial(deleteId);
    setItems((prev) => prev.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    router.refresh();
  };

  const published = items.filter((t) => t.status === 'Published').length;
  const featured  = items.filter((t) => t.featured).length;
  const avgRating = items.length ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1) : '—';

  const columns: Column<TestimonialRow>[] = [
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
                <button onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
