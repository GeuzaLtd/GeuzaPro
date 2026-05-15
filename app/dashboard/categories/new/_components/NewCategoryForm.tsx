'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';
import { DashboardHeader, PageHeader } from '@/components/dashboard';
import { createCategory } from '@/actions/categories';
import { useRouter } from 'next/navigation';

const fieldVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function NewCategoryForm() {
  const router = useRouter();
  const [name,   setName]   = useState('');
  const [type,   setType]   = useState<'product' | 'blog'>('product');
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleSave = async () => {
    if (!name.trim()) { setError('Name is required.'); return; }
    setError('');
    setSaving(true);
    await createCategory({ name: name.trim(), type });
    setSaving(false);
    router.push('/dashboard/categories');
  };

  return (
    <>
      <DashboardHeader title="Add Category" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard/categories"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <HiOutlineArrowLeft size={15} />
            Back to Categories
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60">
            {saving ? (
              <motion.span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            ) : <HiOutlineSave size={14} />}
            Save Category
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <PageHeader
            title="Add New Category"
            description="Create a product or blog category"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Categories', href: '/dashboard/categories' },
              { label: 'New Category' },
            ]}
          />

          <div className="flex flex-col gap-5">
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="e.g. Wheelchairs"
                  className="w-full text-2xl font-display font-black text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent"
                />
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>
            </motion.div>

            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Type</label>
                <div className="flex gap-3">
                  {(['product', 'blog'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                        type === t
                          ? t === 'product'
                            ? 'border-[#0F9E59] bg-[#0F9E59] text-white'
                            : 'border-[#FF7900] bg-[#FF7900] text-white'
                          : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                      }`}
                    >
                      {t === 'product' ? 'Product' : 'Blog'}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
