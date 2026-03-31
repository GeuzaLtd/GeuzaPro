'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface ProductImage { id: number; url: string; isPrimary: boolean; }
interface Category    { id: number; name: string; }
interface Product {
  id:          number;
  name:        string;
  description: string | null;
  stock:       number;
  status:      string;
  sizes:       string[];
  colors:      string[];
  images:      ProductImage[];
  categories:  Category[];
}

const ITEMS_PER_PAGE = 8;

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default function ShopGrid({
  products,
  categories,
}: {
  products:   Product[];
  categories: string[];
}) {
  const allCategories = useMemo(() => ['All', ...categories], [categories]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page,   setPage  ] = useState(1);

  const filtered = useMemo(() => {
    let r = products;
    if (activeFilter !== 'All') r = r.filter((p) => p.categories.some((c) => c.name === activeFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(q));
    }
    return r;
  }, [products, activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFilter = (f: string) => { setActiveFilter(f); setPage(1); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); };

  return (
    <section className="py-12 md:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" value={search} onChange={handleSearch} placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allCategories.map((f) => {
              const count = f === 'All'
                ? products.length
                : products.filter((p) => p.categories.some((c) => c.name === f)).length;
              return (
                <button key={f} onClick={() => handleFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {f}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeFilter === f ? 'bg-white/20 text-white' : 'bg-white text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 mb-6">
          {filtered.length === 0
            ? 'No products found'
            : `Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Grid */}
        {paginated.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {paginated.map((product, i) => {
                const primaryImg = product.images.find((img) => img.isPrimary) ?? product.images[0];
                const inStock    = product.status !== 'out_stock' && product.stock > 0;

                return (
                  <motion.div key={product.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22, delay: i * 0.04 }}>
                    <Link href={`/shop/${product.id}`}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

                      <div className="relative h-44 bg-gray-50 overflow-hidden flex-shrink-0">
                        {primaryImg ? (
                          <Image src={primaryImg.url} alt={product.name} fill
                            className="object-contain p-5 group-hover:scale-105 transition-transform duration-300" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                        <span className={`absolute top-2 left-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          inStock ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'
                        }`}>
                          {inStock ? (product.status === 'low_stock' ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                        </span>
                        {product.images.length > 1 && (
                          <span className="absolute bottom-2 right-2 text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded-full">
                            +{product.images.length - 1} photos
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col gap-1.5 flex-1">
                        {product.categories.length > 0 && (
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{product.categories.map(c => c.name).join(', ')}</span>
                        )}
                        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{product.name}</p>
                        <p className={`text-xs font-medium ${inStock ? 'text-primary' : 'text-red-500'}`}>
                          {inStock ? (product.status === 'low_stock' ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                        </p>
                        {(product.sizes.length > 0 || product.colors.length > 0) && (
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.length  > 0 && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{product.sizes.length} sizes</span>}
                            {product.colors.length > 0 && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{product.colors.length} colours</span>}
                          </div>
                        )}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <span className="text-xs text-primary font-semibold group-hover:underline">View Details →</span>
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-gray-500 text-base font-medium">No products found</p>
            <button onClick={() => { setSearch(''); setActiveFilter('All'); setPage(1); }}
              className="mt-3 text-sm text-primary font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            {getPageNumbers(safePage, totalPages).map((n, i) =>
              n === '…' ? (
                <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">…</span>
              ) : (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                    n === safePage ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary'
                  }`}>
                  {n}
                </button>
              )
            )}

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
