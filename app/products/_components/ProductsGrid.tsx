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

const ITEMS_PER_PAGE = 6;

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default function ProductsGrid({
  products,
  categories,
}: {
  products:   Product[];
  categories: string[];
}) {
  const allCategories = useMemo(() => ['All', ...categories], [categories]);

  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [page,   setPage  ] = useState(1);

  const filtered = useMemo(() => {
    let r = active === 'All' ? products : products.filter((p) => p.categories.some((c) => c.name === active));
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }
    return r;
  }, [products, active, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleCategory = (cat: string) => { setActive(cat); setPage(1); };
  const handleSearch   = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); };
  const clearFilters   = () => { setSearch(''); setActive('All'); setPage(1); };

  return (
    <section className="py-12 md:py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Search */}
        <div className="relative mb-8 max-w-lg">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={handleSearch} placeholder="Search products…"
            className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {allCategories.map((cat) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                active === cat
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-8">
          {filtered.length === 0
            ? 'No products found'
            : `Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Grid */}
        {paginated.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {paginated.map((product, i) => {
                const primaryImg = product.images.find((img) => img.isPrimary) ?? product.images[0];
                const inStock    = product.status !== 'out_stock' && product.stock > 0;

                return (
                  <motion.div key={product.id} layout
                    initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25, delay: i * 0.06 }}>
                    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">

                      <Link href={`/shop/${product.id}`} className="block">
                        <div className="relative h-52 bg-gray-50 overflow-hidden flex-shrink-0">
                          {primaryImg ? (
                            <Image src={primaryImg.url} alt={product.name} fill
                              className="object-contain p-6 group-hover:scale-105 transition-transform duration-300" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                          <span className={`absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${
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
                      </Link>

                      <div className="flex flex-col flex-1 p-5">
                        {product.categories.length > 0 && (
                          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-400 mb-1">
                            {product.categories.map(c => c.name).join(', ')}
                          </span>
                        )}
                        <Link href={`/shop/${product.id}`}>
                          <h3 className="font-display font-bold text-gray-900 text-lg leading-snug mb-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.description && (
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                            {product.description}
                          </p>
                        )}

                        {(product.sizes.length > 0 || product.colors.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {product.sizes.length  > 0 && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{product.sizes.length} sizes</span>}
                            {product.colors.length > 0 && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{product.colors.length} colours</span>}
                          </div>
                        )}

                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <Link href={`/shop/${product.id}`}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all duration-300">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Order This Product
                          </Link>
                        </div>
                      </div>
                    </div>
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
            <p className="text-gray-400 text-sm mt-1 mb-4">Try a different keyword or category.</p>
            <button onClick={clearFilters} className="text-sm text-primary font-medium hover:underline">
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            {getPageNumbers(safePage, totalPages).map((n, i) =>
              n === '…' ? (
                <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm select-none">…</span>
              ) : (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                    n === safePage ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary'
                  }`}>
                  {n}
                </button>
              )
            )}

            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
