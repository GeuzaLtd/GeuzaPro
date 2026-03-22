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
  HiOutlineMail,
  HiOutlinePhone,
} from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';
import { createEmployee, updateEmployee, deleteEmployee } from '@/actions/employees';

export interface EmployeeRow {
  id: number;
  name: string;
  role: string;
  department: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  joined: string;
  avatar: string | null;
}

const DEPARTMENTS = ['Leadership', 'Engineering', 'Design', 'Operations', 'Outreach', 'Finance', 'Marketing'];

function EmployeeModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Partial<EmployeeRow> | null;
  onClose: () => void;
  onSave: (e: { name: string; role: string; department: string; email: string; phone: string; status: string; isNew: boolean; id?: number }) => Promise<void>;
}) {
  const isNew = !employee?.id;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:       employee?.name       ?? '',
    role:       employee?.role       ?? '',
    department: employee?.department ?? 'Engineering',
    email:      employee?.email      ?? '',
    phone:      employee?.phone      ?? '',
    status:     employee?.status     ?? 'Active',
  });

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...form, isNew, id: employee?.id });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-3 py-1 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-purple-600 text-xs font-bold tracking-widest uppercase">{isNew ? 'New' : 'Edit'}</span>
            </div>
            <h3 className="font-display font-black text-gray-900 text-xl">{isNew ? 'Add Employee' : 'Edit Employee'}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <HiOutlineX size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-[#0F9E59]/50 hover:text-[#0F9E59] transition-all cursor-pointer flex-shrink-0">
              <HiOutlinePhotograph size={22} />
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Job Title</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Lead Engineer"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all bg-white">
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@geuza.rw"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+250 788 000 000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
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

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60">
            {saving ? 'Saving…' : isNew ? 'Add Employee' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function EmployeesView({ initialData }: { initialData: EmployeeRow[] }) {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeRow[]>(initialData);
  const [modal, setModal]         = useState<Partial<EmployeeRow> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const openCreate = () => { setModal({}); setShowModal(true); };
  const openEdit   = (e: EmployeeRow) => { setModal(e); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setTimeout(() => setModal(null), 200); };

  const handleSave = async (data: { name: string; role: string; department: string; email: string; phone: string; status: string; isNew: boolean; id?: number }) => {
    const isVisible = data.status === 'Active';
    if (data.isNew) {
      const created = await createEmployee({ name: data.name, role: data.role, bio: data.department });
      setEmployees((prev) => [
        {
          id: created.id,
          name: created.name,
          role: created.role,
          department: data.department,
          email: data.email || null,
          phone: data.phone || null,
          status: data.status,
          joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          avatar: null,
        },
        ...prev,
      ]);
    } else if (data.id !== undefined) {
      await updateEmployee(data.id, { name: data.name, role: data.role, isVisible });
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === data.id
            ? { ...e, name: data.name, role: data.role, department: data.department, email: data.email || null, phone: data.phone || null, status: data.status }
            : e
        )
      );
    }
    closeModal();
    router.refresh();
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteEmployee(deleteId);
    setEmployees((prev) => prev.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    router.refresh();
  };

  const active = employees.filter((e) => e.status === 'Active').length;

  const columns: Column<EmployeeRow>[] = [
    { key: 'name', label: 'Employee', sortable: true, render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F9E59] to-[#1bc870] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {e.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{e.name}</p>
            <p className="text-xs text-gray-400">{e.role}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department', sortable: true, render: (e) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{e.department ?? '—'}</span>
      ),
    },
    { key: 'email', label: 'Contact', render: (e) => (
        <div>
          <p className="text-sm text-gray-600 flex items-center gap-1.5"><HiOutlineMail size={12} className="text-gray-400" />{e.email ?? '—'}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><HiOutlinePhone size={12} className="text-gray-400" />{e.phone ?? '—'}</p>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
    { key: 'joined', label: 'Since',  sortable: true, render: (e) => <span className="text-gray-400 text-xs">{e.joined}</span> },
  ];

  return (
    <>
      <DashboardHeader title="Employees" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Employees"
          description="Manage your team members and roles"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Employees' }]}
          action={
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20">
              <HiOutlinePlus size={16} /> Add Employee
            </button>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Staff', value: employees.length,          color: '#0F9E59' },
            { label: 'Active',      value: active,                    color: '#0F9E59' },
            { label: 'Departments', value: DEPARTMENTS.length,        color: '#8b5cf6' },
            { label: 'Inactive',    value: employees.length - active, color: '#FF7900' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <AdminTable columns={columns} data={employees} searchKeys={['name', 'role', 'department']} pageSize={8}
          actions={(e) => (
            <>
              <button onClick={() => openEdit(e)}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all" title="Edit">
                <HiOutlinePencil size={14} />
              </button>
              <button onClick={() => setDeleteId(e.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all" title="Remove">
                <HiOutlineTrash size={14} />
              </button>
            </>
          )}
        />
      </main>

      <AnimatePresence>
        {showModal && modal !== null && (
          <EmployeeModal employee={modal} onClose={closeModal} onSave={handleSave} />
        )}
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
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Remove Employee?</h3>
              <p className="text-sm text-gray-500 mb-6">This will permanently remove this employee from the system.</p>
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
