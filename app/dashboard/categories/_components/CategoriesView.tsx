'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';
import { DashboardHeader, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';
import { deleteCategory, updateCategory } from '@/actions/categories';

export interface CategoryRow {
  id:           number;
  name:         string;
  type:         'product' | 'blog';
  isVisible:    boolean;
  productCount: number;
  blogCount:    number;
}

export default function CategoriesView({ initialData }: { initialData: CategoryRow[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryRow[]>(initialData);
  const [deleteId, setDeleteId]     = useState<number | null>(null);

  const total   = categories.length;
  const product = categories.filter((c) => c.type === 'product').length;
  const blog    = categories.filter((c) => c.type === 'blog').length;
  const hidden  = categories.filter((c) => !c.isVisible).length;

  const columns: Column<CategoryRow>[] = [
    {
      key: 'name', label: 'Name', sortable: true,
      render: (c) => <span className="font-medium text-gray-800 text-sm">{c.name}</span>,
    },
    {
      key: 'type', label: 'Type', sortable: true,
      render: (c) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
          c.type === 'product'
            ? 'bg-[#0F9E59]/10 text-[#0F9E59]'
            : 'bg-[#FF7900]/10 text-[#FF7900]'
        }`}>
          {c.type === 'product' ? 'Product' : 'Blog'}
        </span>
      ),
    },
    {
      key: 'productCount', label: 'Used in', sortable: true,
      render: (c) => (
        <span className="text-sm text-gray-600">
          {c.type === 'product' ? `${c.productCount} product${c.productCount !== 1 ? 's' : ''}` : `${c.blogCount} post${c.blogCount !== 1 ? 's' : ''}`}
        </span>
      ),
    },
    {
      key: 'isVisible', label: 'Visibility',
      render: (c) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          c.isVisible ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {c.isVisible ? 'Visible' : 'Hidden'}
        </span>
      ),
    },
  ];

  const handleToggleVisibility = async (cat: CategoryRow) => {
    const updated = { ...cat, isVisible: !cat.isVisible };
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? updated : c)));
    await updateCategory(cat.id, { isVisible: !cat.isVisible });
    router.refresh();
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteCategory(deleteId);
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    router.refresh();
  };

  return (
    <>
      <DashboardHeader title="Categories" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Categories"
          description="Manage product and blog categories"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Categories' }]}
          action={
            <Link
              href="/dashboard/categories/new"
              className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20"
            >
              <HiOutlinePlus size={16} />
              Add Category
            </Link>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Categories', value: total,   color: '#0F9E59' },
            { label: 'Product',          value: product, color: '#0F9E59' },
            { label: 'Blog',             value: blog,    color: '#FF7900' },
            { label: 'Hidden',           value: hidden,  color: '#9ca3af' },
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
          data={categories}
          searchKeys={['name', 'type']}
          pageSize={10}
          actions={(c) => (
            <>
              <button
                onClick={() => handleToggleVisibility(c)}
                className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition-all"
                title={c.isVisible ? 'Hide' : 'Show'}
              >
                {c.isVisible ? <HiOutlineEyeOff size={14} /> : <HiOutlineEye size={14} />}
              </button>
              <Link
                href={`/dashboard/categories/${c.id}/edit`}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all"
                title="Edit"
              >
                <HiOutlinePencil size={14} />
              </Link>
              <button
                onClick={() => setDeleteId(c.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all"
                title="Delete"
              >
                <HiOutlineTrash size={14} />
              </button>
            </>
          )}
        />
      </main>

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
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Delete Category?</h3>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
