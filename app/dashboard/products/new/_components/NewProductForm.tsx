'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlinePlus,
  HiOutlineX,
} from 'react-icons/hi';
import { DashboardHeader, PageHeader } from '@/components/dashboard';
import ImageUploadSlot from '@/components/dashboard/ImageUploadSlot';
import { createProduct } from '@/actions/products';
import { useRouter } from 'next/navigation';

const COLOURS = [
  { name: 'White',  hex: '#f9fafb', border: true  },
  { name: 'Black',  hex: '#111827', border: false },
  { name: 'Yellow', hex: '#eab308', border: false },
  { name: 'Green',  hex: '#22c55e', border: false },
  { name: 'Red',    hex: '#ef4444', border: false },
  { name: 'Grey',   hex: '#9ca3af', border: false },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const fieldVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function NewProductForm({
  allCategories,
}: {
  allCategories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name:        '',
    price:       '',
    stock:       '',
    sku:         '',
    status:      'In Stock',
    description: '',
    features:    [] as string[],
    weight:      '',
    dimensions:  '',
  });
  const [images, setImages] = useState<{ url: string | null; publicId: string | null }[]>([
    { url: null, publicId: null },
    { url: null, publicId: null },
    { url: null, publicId: null },
    { url: null, publicId: null },
  ]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedColors,      setSelectedColors]      = useState<string[]>([]);
  const [selectedSizes,       setSelectedSizes]       = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving]             = useState(false);
  const [saved,  setSaved]              = useState(false);

  const toggleCategory = (id: number) =>
    setSelectedCategoryIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const toggleColor = (name: string) =>
    setSelectedColors((prev) => prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]);

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);

  const setImage = (index: number) => (url: string | null, publicId: string | null) =>
    setImages((prev) => prev.map((img, i) => (i === index ? { url, publicId } : img)));

  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) setForm((s) => ({ ...s, features: [...s.features, f] }));
    setFeatureInput('');
  };
  const removeFeature = (f: string) => setForm((s) => ({ ...s, features: s.features.filter((x) => x !== f) }));

  const handleSave = async () => {
    setSaving(true);
    const uploadedImages = images
      .filter((img) => img.url)
      .map((img, i) => ({ url: img.url!, isPrimary: i === 0 }));

    await createProduct({
      name:        form.name,
      description: form.description,
      price:       parseFloat(form.price.replace(/,/g, '')) || 0,
      stock:       parseInt(form.stock) || 0,
      categoryIds: selectedCategoryIds,
      colors:      selectedColors,
      sizes:       selectedSizes,
      images:      uploadedImages.length > 0 ? uploadedImages : undefined,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.push('/dashboard/products');
  };

  return (
    <>
      <DashboardHeader title="Add Product" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Action bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <HiOutlineArrowLeft size={15} />
            Back to Products
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-[#0F9E59] font-semibold">
                ✓ Product saved
              </motion.span>
            )}
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60">
              {saving ? (
                <motion.span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              ) : <HiOutlineSave size={14} />}
              Save Product
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <PageHeader
            title="Add New Product"
            description="List a new assistive device in the catalogue"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Products', href: '/dashboard/products' },
              { label: 'New Product' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main content ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Standard Wheelchair"
                    className="w-full text-2xl font-display font-black text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent" />
                </div>
              </motion.div>

              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Images</label>
                  <div className="grid grid-cols-4 gap-3">
                    <ImageUploadSlot value={images[0].url} onChange={setImage(0)} isPrimary size="lg" folder="geuza/products" />
                    <ImageUploadSlot value={images[1].url} onChange={setImage(1)} size="sm" folder="geuza/products" />
                    <ImageUploadSlot value={images[2].url} onChange={setImage(2)} size="sm" folder="geuza/products" />
                    <ImageUploadSlot value={images[3].url} onChange={setImage(3)} size="sm" folder="geuza/products" />
                  </div>
                </div>
              </motion.div>

              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the product, its purpose, and who it's designed for..."
                    rows={5}
                    className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent resize-none leading-relaxed" />
                </div>
              </motion.div>

              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Features</label>
                  <div className="flex flex-col gap-2 mb-4">
                    {form.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#0F9E59]/5 rounded-xl px-4 py-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F9E59] flex-shrink-0" />
                        <span className="text-sm text-gray-700 flex-1">{f}</span>
                        <button onClick={() => removeFeature(f)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <HiOutlineX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                      placeholder="e.g. Adjustable height from 43cm to 53cm"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                    <button onClick={addFeature}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white text-sm font-semibold transition-all">
                      <HiOutlinePlus size={14} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Specifications</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Weight</label>
                      <input type="text" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        placeholder="e.g. 12 kg"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Dimensions</label>
                      <input type="text" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                        placeholder="e.g. 65×45×90 cm"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-5">

              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pricing</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (RWF)</label>
                    <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. 45,000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                  </div>
                </div>
              </motion.div>

              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Inventory</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SKU</label>
                      <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        placeholder="e.g. WC-001"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quantity in Stock</label>
                      <input type="number" value={form.stock} min={0} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Categories</p>
                  <p className="text-[10px] text-gray-400 mb-4">Select all that apply</p>
                  <div className="flex flex-col gap-1.5">
                    {allCategories.map((c) => {
                      const checked = selectedCategoryIds.includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-3 cursor-pointer group py-1" onClick={() => toggleCategory(c.id)}>
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${checked ? 'bg-[#0F9E59] border-[#0F9E59]' : 'border-gray-300 group-hover:border-[#0F9E59]/50'}`}>
                            {checked && (
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Colours */}
              <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Available Colours</p>
                  <div className="flex flex-col gap-2">
                    {COLOURS.map((c) => {
                      const selected = selectedColors.includes(c.name);
                      return (
                        <button key={c.name} type="button" onClick={() => toggleColor(c.name)}
                          className={`flex items-center gap-3 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            selected ? 'border-[#0F9E59] bg-[#0F9E59]/5 text-gray-900' : 'border-gray-100 text-gray-500 hover:border-gray-200'
                          }`}>
                          <span className="w-5 h-5 rounded-full flex-shrink-0 border border-gray-300" style={{ backgroundColor: c.hex }} />
                          {c.name}
                          {selected && (
                            <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F9E59" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Sizes */}
              <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Available Sizes</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((size) => {
                      const selected = selectedSizes.includes(size);
                      return (
                        <button key={size} type="button" onClick={() => toggleSize(size)}
                          className={`py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                            selected
                              ? 'border-[#0F9E59] bg-[#0F9E59] text-white'
                              : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                          }`}>
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Stock status */}
              <motion.div custom={10} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Stock Status</p>
                  <div className="flex flex-col gap-2">
                    {['In Stock', 'Low Stock', 'Out Stock'].map((s) => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                        className={`py-2.5 px-4 rounded-xl text-sm font-semibold border text-left transition-all ${
                          form.status === s ? 'bg-[#0F9E59] text-white border-[#0F9E59] shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
