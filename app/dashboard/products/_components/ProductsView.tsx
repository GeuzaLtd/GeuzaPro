'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';
import { deleteProduct } from '@/actions/products';

export interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  status: string;
  isVisible: boolean;
  category: string | null;
  createdAt: string;
}

export default function ProductsView({ initialData }: { initialData: ProductRow[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>(initialData);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const inStock  = products.filter((p) => p.status === 'In Stock').length;
  const lowStock = products.filter((p) => p.status === 'Low Stock').length;
  const outStock = products.filter((p) => p.status === 'Out of Stock').length;

  const columns: Column<ProductRow>[] = [
    { key: 'name', label: 'Product', sortable: true, render: (p) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{p.name}</p>
          {p.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>}
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: true, render: (p) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{p.category ?? '—'}</span>
      ),
    },
    { key: 'price', label: 'Price', sortable: true, render: (p) => <span className="font-semibold text-gray-800 text-sm">{p.price}</span> },
    { key: 'stock', label: 'Stock', sortable: true, render: (p) => (
        <span className={`font-semibold text-sm ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-yellow-600' : 'text-gray-700'}`}>
          {p.stock}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
  ];

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteProduct(deleteId);
    setProducts((prev) => prev.filter((x) => x.id !== deleteId));
    setDeleteId(null);
    router.refresh();
  };

  return (
    <>
      <DashboardHeader title="Products" />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Products"
          description="Manage your assistive device inventory"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products' }]}
          action={
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20"
            >
              <HiOutlinePlus size={16} />
              Add Product
            </Link>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: products.length, color: '#0F9E59' },
            { label: 'In Stock',       value: inStock,         color: '#0F9E59' },
            { label: 'Low Stock',      value: lowStock,        color: '#FF7900' },
            { label: 'Out of Stock',   value: outStock,        color: '#ef4444' },
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
          data={products}
          searchKeys={['name', 'category']}
          pageSize={8}
          actions={(p) => (
            <>
              <Link
                href={`/dashboard/products/${p.id}/edit`}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all"
                title="Edit"
              >
                <HiOutlinePencil size={14} />
              </Link>
              <button onClick={() => setDeleteId(p.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all" title="Delete">
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
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Delete Product?</h3>
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
