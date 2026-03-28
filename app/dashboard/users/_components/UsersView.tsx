'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEye, HiOutlineTrash, HiOutlineX, HiOutlineUsers } from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';
import { updateUser, deleteUser } from '@/actions/users';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  orders: number;
  donations: number;
}

function UserDetailModal({
  user,
  onClose,
  onToggle,
}: {
  user: UserRow;
  onClose: () => void;
  onToggle: (id: number, currentStatus: string) => Promise<void>;
}) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(user.id, user.status);
    setToggling(false);
    onClose();
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <p className="font-display font-black text-gray-900 text-xl">User Profile</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <HiOutlineX size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0F9E59] to-[#1bc870] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
              {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <StatusBadge status={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { label: 'Orders',    value: user.orders },
              { label: 'Donations', value: user.donations },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="font-display font-black text-gray-900 text-2xl">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {[
            { label: 'Joined', value: user.joined },
            { label: 'Email',  value: user.email },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm text-gray-700 font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Close</button>
          <button onClick={handleToggle} disabled={toggling} className="flex-1 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all disabled:opacity-60">
            {toggling ? 'Saving…' : user.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UsersView({ initialData }: { initialData: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers]       = useState<UserRow[]>(initialData);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const active = users.filter((u) => u.status === 'Active').length;
  const admins = users.filter((u) => u.role === 'Admin').length;
  const donors = users.filter((u) => u.role === 'Donor').length;

  const columns: Column<UserRow>[] = [
    { key: 'name', label: 'User', sortable: true, render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F9E59] to-[#1bc870] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{u.name}</p>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role',      label: 'Role',      render: (u) => <StatusBadge status={u.role} /> },
    { key: 'status',    label: 'Status',    render: (u) => <StatusBadge status={u.status} /> },
    { key: 'orders',    label: 'Orders',    sortable: true, render: (u) => <span className="text-gray-600 text-sm">{u.orders}</span> },
    { key: 'donations', label: 'Donations', sortable: true, render: (u) => <span className="text-gray-600 text-sm">{u.donations}</span> },
    { key: 'joined',    label: 'Joined',    sortable: true, render: (u) => <span className="text-gray-400 text-xs whitespace-nowrap">{u.joined}</span> },
  ];

  const handleToggle = async (id: number, currentStatus: string) => {
    const newVisible = currentStatus !== 'Active';
    await updateUser(id, { isVisible: newVisible });
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: newVisible ? 'Active' : 'Inactive' } : u)
    );
    router.refresh();
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteUser(deleteId);
    setUsers((prev) => prev.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    router.refresh();
  };

  return (
    <>
      <DashboardHeader title="Users" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Users"
          description="Manage platform members and access"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users' }]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length, color: '#0F9E59' },
            { label: 'Active',      value: active,       color: '#0F9E59' },
            { label: 'Donors',      value: donors,       color: '#FF7900' },
            { label: 'Admins',      value: admins,       color: '#8b5cf6' },
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
          data={users}
          searchKeys={['name', 'email', 'role']}
          pageSize={8}
          actions={(u) => (
            <>
              <button onClick={() => setSelected(u)}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all" title="View">
                <HiOutlineEye size={14} />
              </button>
              <button onClick={() => setDeleteId(u.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all" title="Remove">
                <HiOutlineTrash size={14} />
              </button>
            </>
          )}
        />
      </main>

      <AnimatePresence>
        {selected && (
          <UserDetailModal
            user={selected}
            onClose={() => setSelected(null)}
            onToggle={handleToggle}
          />
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
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Remove User?</h3>
              <p className="text-sm text-gray-500 mb-6">This will permanently remove the user&apos;s account.</p>
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
