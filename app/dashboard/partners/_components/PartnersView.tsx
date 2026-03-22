'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineGlobe,
  HiOutlineMail,
  HiOutlinePhone,
} from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';
import { createPartner, updatePartner, deletePartner } from '@/actions/partners';

export interface PartnerRow {
  id: number;
  name: string;
  type: string | null;
  contact: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  status: string;
  since: string;
  description: string | null;
}

const TYPES = ['NGO', 'Government', 'Corporate', 'UN Agency', 'International', 'Individual'];

function PartnerModal({
  partner,
  onClose,
  onSave,
}: {
  partner: Partial<PartnerRow> | null;
  onClose: () => void;
  onSave: (p: { name: string; type: string; contact: string; email: string; phone: string; country: string; status: string; description: string; isNew: boolean; id?: number }) => Promise<void>;
}) {
  const isNew = !partner?.id;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:        partner?.name        ?? '',
    type:        partner?.type        ?? 'NGO',
    contact:     partner?.contact     ?? '',
    email:       partner?.email       ?? '',
    phone:       partner?.phone       ?? '',
    country:     partner?.country     ?? 'Rwanda',
    status:      partner?.status      ?? 'Active',
    description: partner?.description ?? '',
  });

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...form, isNew, id: partner?.id });
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
            <div className="inline-flex items-center gap-2 bg-[#0F9E59]/10 rounded-full px-3 py-1 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F9E59]" />
              <span className="text-[#0F9E59] text-xs font-bold tracking-widest uppercase">{isNew ? 'New Partner' : 'Edit Partner'}</span>
            </div>
            <h3 className="font-display font-black text-gray-900 text-xl">{isNew ? 'Add Partner' : 'Edit Partner'}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <HiOutlineX size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Organization Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Hope Foundation Rwanda"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all bg-white">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
              <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g. Rwanda"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contact Person</label>
            <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="e.g. Jean-Paul Habimana"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@org.rw"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+250 788 000 000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the partnership..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
            <div className="flex gap-3">
              {['Active', 'Inactive'].map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${form.status === s ? 'bg-[#0F9E59] text-white border-[#0F9E59]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60">
            {saving ? 'Saving…' : isNew ? 'Add Partner' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PartnersView({ initialData }: { initialData: PartnerRow[] }) {
  const router = useRouter();
  const [partners, setPartners]   = useState<PartnerRow[]>(initialData);
  const [modal, setModal]         = useState<Partial<PartnerRow> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const openCreate = () => { setModal({}); setShowModal(true); };
  const openEdit   = (p: PartnerRow) => { setModal(p); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setTimeout(() => setModal(null), 200); };

  const handleSave = async (data: { name: string; type: string; contact: string; email: string; phone: string; country: string; status: string; description: string; isNew: boolean; id?: number }) => {
    const isVisible = data.status === 'Active';
    if (data.isNew) {
      const created = await createPartner({
        name: data.name,
        description: data.description || undefined,
        contactName: data.contact || undefined,
        contactEmail: data.email || undefined,
      });
      setPartners((prev) => [
        {
          id: created.id,
          name: created.name,
          type: data.type,
          contact: data.contact || null,
          email: data.email || null,
          phone: data.phone || null,
          country: data.country || null,
          status: data.status,
          since: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          description: data.description || null,
        },
        ...prev,
      ]);
    } else if (data.id !== undefined) {
      await updatePartner(data.id, {
        name: data.name,
        description: data.description || undefined,
        contactName: data.contact || undefined,
        contactEmail: data.email || undefined,
        isVisible,
      });
      setPartners((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? { ...p, name: data.name, type: data.type, contact: data.contact || null, email: data.email || null, phone: data.phone || null, country: data.country || null, status: data.status, description: data.description || null }
            : p
        )
      );
    }
    closeModal();
    router.refresh();
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deletePartner(deleteId);
    setPartners((prev) => prev.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    router.refresh();
  };

  const active = partners.filter((p) => p.status === 'Active').length;

  const columns: Column<PartnerRow>[] = [
    { key: 'name', label: 'Organization', sortable: true, render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F9E59]/10 flex items-center justify-center flex-shrink-0">
            <HiOutlineGlobe size={16} className="text-[#0F9E59]" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
            {p.description && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>}
          </div>
        </div>
      ),
    },
    { key: 'type',    label: 'Type',    sortable: true, render: (p) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{p.type ?? '—'}</span>
      ),
    },
    { key: 'contact', label: 'Contact', render: (p) => (
        <div>
          <p className="text-sm text-gray-700 font-medium">{p.contact ?? '—'}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><HiOutlineMail size={11} />{p.email ?? '—'}</p>
        </div>
      ),
    },
    { key: 'country', label: 'Country', render: (p) => <span className="text-gray-500 text-sm">{p.country ?? '—'}</span> },
    { key: 'status',  label: 'Status',  render: (p) => <StatusBadge status={p.status} /> },
    { key: 'since',   label: 'Since',   sortable: true, render: (p) => <span className="text-gray-400 text-xs">{p.since}</span> },
  ];

  return (
    <>
      <DashboardHeader title="Partners" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Partners"
          description="Manage organizations and institutions we work with"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Partners' }]}
          action={
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20">
              <HiOutlinePlus size={16} /> Add Partner
            </button>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Partners', value: partners.length, color: '#0F9E59' },
            { label: 'Active',         value: active,          color: '#0F9E59' },
            { label: 'Countries',      value: [...new Set(partners.map((p) => p.country).filter(Boolean))].length, color: '#3b82f6' },
            { label: 'Types',          value: [...new Set(partners.map((p) => p.type).filter(Boolean))].length,    color: '#FF7900' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <AdminTable columns={columns} data={partners} searchKeys={['name', 'type', 'country', 'contact']} pageSize={8}
          actions={(p) => (
            <>
              <button onClick={() => openEdit(p)}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all" title="Edit">
                <HiOutlinePencil size={14} />
              </button>
              <button onClick={() => setDeleteId(p.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all" title="Remove">
                <HiOutlineTrash size={14} />
              </button>
            </>
          )}
        />
      </main>

      <AnimatePresence>
        {showModal && modal !== null && <PartnerModal partner={modal} onClose={closeModal} onSave={handleSave} />}
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
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Remove Partner?</h3>
              <p className="text-sm text-gray-500 mb-6">This will remove them from the partner list.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
