'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { products, CATEGORIES, type Category } from '@/lib/products';

const ITEMS_PER_PAGE = 6;

export default function ProductsGrid() {
  const [active, setActive] = useState<Category>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = active === 'All' ? products : products.filter((p) => p.category === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [active, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleCategory = (cat: Category) => { setActive(cat); setPage(1); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); };
  const clearFilters = () => { setSearch(''); setActive('All'); setPage(1); };

  return (
    <section className="py-12 md:py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* ── Search bar ── */}
        <div className="relative mb-8 max-w-lg">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products…"
            className="w-full pl-11 pr-10 py-3 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Category filter ── */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                active === cat
                  ? 'bg-[#0F9E59] text-white border-[#0F9E59] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#0F9E59] hover:text-[#0F9E59]'
              }`}
            >
              {cat}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  active === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat === 'All' ? products.length : products.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Results summary ── */}
        <p className="text-sm text-gray-400 mb-8">
          {filtered.length === 0
            ? 'No products found'
            : `Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* ── Products grid ── */}
        {paginated.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {paginated.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                >
                  <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">

                    {/* Image area */}
                    <div className="relative h-52 bg-gray-50 overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                          product.inStock
                            ? 'bg-[#0F9E59]/10 text-[#0F9E59]'
                            : 'bg-red-50 text-red-500'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Info area */}
                    <div className="flex flex-col flex-1 p-5">
                      <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-400 mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-display font-bold text-gray-900 text-lg leading-snug mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                        {product.description}
                      </p>
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="text-[#0F9E59] font-bold text-xl mb-3">{product.price}</p>
                        <Link
                          href="/shop"
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-medium hover:bg-[#0d8a4d] transition-all duration-300"
                          aria-label={`View ${product.name} in store`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9h18l-2 9H5L3 9z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" />
                          </svg>
                          View in Store
                        </Link>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── Empty state ── */
          <div className="text-center py-24">
            <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-gray-500 text-base font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">
              Try a different keyword or category.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-[#0F9E59] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-label={`Page ${n}`}
                aria-current={n === safePage ? 'page' : undefined}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                  n === safePage
                    ? 'bg-[#0F9E59] text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59]'
                }`}
              >
                {n}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
