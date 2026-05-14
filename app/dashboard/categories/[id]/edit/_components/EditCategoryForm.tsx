'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineSave } from 'react-icons/hi';
import { DashboardHeader, PageHeader } from '@/components/dashboard';
import { updateCategory } from '@/actions/categories';
import { useRouter } from 'next/navigation';

interface CategoryData {
  id:        number;
  name:      string;
  type:      'product' | 'blog';
  isVisible: boolean;
}

const fieldVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function EditCategoryForm({ category }: { category: CategoryData }) {
  const router = useRouter();
  const [name,      setName]      = useState(category.name);
  const [type,      setType]      = useState<'product' | 'blog'>(category.type);
  const [isVisible, setIsVisible] = useState(category.isVisible);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  const handleSave = async () => {
    if (!name.trim()) { setError('Name is required.'); return; }
    setError('');
    setSaving(true);
    await updateCategory(category.id, { name: name.trim(), isVisible });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.push('/dashboard/categories');
  };

  return (
    <>
      <DashboardHeader title="Edit Category" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard/categories"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <HiOutlineArrowLeft size={15} />
            Back to Categories
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="text-xs text-[#0F9E59] font-semibold">
                ✓ Saved
              </motion.span>
            )}
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60">
              {saving ? (
                <motion.span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              ) : <HiOutlineSave size={14} />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <PageHeader
            title="Edit Category"
            description={`Editing "${category.name}"`}
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Categories', href: '/dashboard/categories' },
              { label: 'Edit' },
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                <p className="text-xs text-gray-400 mb-4">Type cannot be changed after creation.</p>
                <div className="flex gap-3">
                  {(['product', 'blog'] as const).map((t) => (
                    <div
                      key={t}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold text-center transition-all ${
                        type === t
                          ? t === 'product'
                            ? 'border-[#0F9E59] bg-[#0F9E59] text-white'
                            : 'border-[#FF7900] bg-[#FF7900] text-white'
                          : 'border-gray-100 text-gray-300'
                      }`}
                    >
                      {t === 'product' ? 'Product' : 'Blog'}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Visibility</label>
                <div className="flex gap-3">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setIsVisible(v)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        isVisible === v
                          ? v
                            ? 'border-[#0F9E59] bg-[#0F9E59] text-white'
                            : 'border-gray-500 bg-gray-500 text-white'
                          : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                      }`}
                    >
                      {v ? 'Visible' : 'Hidden'}
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
