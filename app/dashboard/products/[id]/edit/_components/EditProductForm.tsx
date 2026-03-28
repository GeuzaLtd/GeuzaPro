'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineTrash,
} from 'react-icons/hi';
import { DashboardHeader, PageHeader } from '@/components/dashboard';
import ImageUploadSlot from '@/components/dashboard/ImageUploadSlot';
import { updateProduct, deleteProduct } from '@/actions/products';
import { useRouter } from 'next/navigation';

interface ProductData {
  id:          number;
  name:        string;
  description: string | null;
  price:       string;
  stock:       number;
  status:      string;
  category:    string | null;
  colors?:     string[];
  images?:     { url: string }[];
}

const CATEGORIES = ['Wheelchair', 'Crutches', 'Walking Aid', 'Prosthetics', 'Cane', 'Transfer Aid', 'Daily Living'];

const COLOURS = [
  { name: 'White',  hex: '#f9fafb' },
  { name: 'Black',  hex: '#111827' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green',  hex: '#22c55e' },
  { name: 'Red',    hex: '#ef4444' },
];

const fieldVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function EditProductForm({ product, id }: { product: ProductData | null; id: string }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name:        product?.name        ?? '',
    category:    product?.category    ?? 'Wheelchair',
    price:       product?.price?.replace('RWF ', '').replace(',', '') ?? '',
    stock:       String(product?.stock ?? 0),
    status:      product?.status      ?? 'In Stock',
    description: product?.description ?? '',
    features:    [] as string[],
    weight:      '',
    dimensions:  '',
  });
  const [images, setImages] = useState<{ url: string | null; publicId: string | null }[]>(() => {
    const slots: { url: string | null; publicId: string | null }[] = [
      { url: null, publicId: null },
      { url: null, publicId: null },
      { url: null, publicId: null },
      { url: null, publicId: null },
    ];
    (product?.images ?? []).forEach((img, i) => {
      if (i < 4) slots[i] = { url: img.url, publicId: null };
    });
    return slots;
  });
  const [selectedColors, setSelectedColors] = useState<string[]>(product?.colors ?? []);
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  const toggleColor = (name: string) =>
    setSelectedColors((prev) => prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]);

  const setImage = (index: number) => (url: string | null, publicId: string | null) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { url, publicId } : img)));
  };

  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) setForm((s) => ({ ...s, features: [...s.features, f] }));
    setFeatureInput('');
  };
  const removeFeature = (f: string) => setForm((s) => ({ ...s, features: s.features.filter((x) => x !== f) }));

  const handleSave = async () => {
    setSaving(true);
    const statusMap: Record<string, string> = { 'In Stock': 'in_stock', 'Low Stock': 'low_stock', 'Out Stock': 'out_stock' };
    const uploadedImages = images
      .filter((img) => img.url)
      .map((img, i) => ({ url: img.url!, isPrimary: i === 0 }));
    await updateProduct(parseInt(id), {
      name:        form.name,
      description: form.description,
      price:       parseFloat(form.price.replace(/,/g, '')),
      stock:       parseInt(form.stock),
      status:      statusMap[form.status] ?? 'in_stock',
      colors:      selectedColors,
      ...(uploadedImages.length > 0 && { images: uploadedImages }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteProduct(parseInt(id));
    router.push('/dashboard/products');
  };

  return (
    <>
      <DashboardHeader title="Edit Product" />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <HiOutlineArrowLeft size={15} />
            Back to Products
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-[#0F9E59] font-semibold">
                ✓ Changes saved
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

        <div className="max-w-6xl mx-auto px-6 py-8">
          <PageHeader
            title={product?.name ?? 'Edit Product'}
            description={`Product #${id}`}
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Products', href: '/dashboard/products' },
              { label: 'Edit' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-5">

              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    {form.features.length === 0 && (
                      <p className="text-sm text-gray-300 italic">No features added yet</p>
                    )}
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

              {/* Danger zone */}
              <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-red-100 p-5">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">Danger Zone</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Delete this product</p>
                      <p className="text-xs text-gray-400 mt-0.5">This will remove it from the catalogue permanently.</p>
                    </div>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                      <HiOutlineTrash size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-5">
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pricing</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price (RWF)</label>
                    <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                  </div>
                </div>
              </motion.div>

              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Inventory</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quantity</label>
                      <input type="number" value={form.stock} min={0} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Category</p>
                  <div className="flex flex-col gap-1.5">
                    {CATEGORIES.map((c) => (
                      <label key={c} className="flex items-center gap-3 cursor-pointer group py-1">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${form.category === c ? 'bg-[#0F9E59] border-[#0F9E59]' : 'border-gray-300 group-hover:border-[#0F9E59]/50'}`}
                          onClick={() => setForm({ ...form, category: c })}>
                          {form.category === c && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${form.category === c ? 'text-gray-900 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>{c}</span>
                      </label>
                    ))}
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
                          <span className="w-5 h-5 rounded-full flex-shrink-0 border border-gray-300"
                            style={{ backgroundColor: c.hex }} />
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

              {/* Stock status */}
              <motion.div custom={9} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Stock Status</p>
                  <div className="flex flex-col gap-2">
                    {['In Stock', 'Low Stock', 'Out Stock'].map((s) => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                        className={`py-2.5 px-4 rounded-xl text-sm font-semibold border text-left transition-all ${form.status === s ? 'bg-[#0F9E59] text-white border-[#0F9E59]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
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
