'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { shopProducts, SHOP_FILTERS, type ShopFilter } from '@/lib/shop-products';

const ITEMS_PER_PAGE = 8;

export default function ShopGrid() {
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('All Products');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = shopProducts;
    if (activeFilter === 'Popular') result = result.filter((p) => p.popular);
    if (activeFilter === 'Best Seller') result = result.filter((p) => p.bestSeller);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return result;
  }, [activeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFilter = (f: ShopFilter) => { setActiveFilter(f); setPage(1); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); };

  return (
    <section className="py-12 md:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* ── Toolbar: search + filter tabs ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search for a product"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0F9E59] focus:ring-2 focus:ring-[#0F9E59]/10 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            {SHOP_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Products grid ── */}
        {paginated.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {paginated.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22, delay: i * 0.04 }}
                >
                  <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">

                    {/* Image area */}
                    <div className="relative h-44 bg-gray-50 overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>

                    {/* Info area */}
                    <div className="p-4 flex flex-col gap-1">
                      <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                        {product.name}
                      </p>
                      <p className={`text-xs font-medium ${product.inStock ? 'text-[#0F9E59]' : 'text-red-500'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-800 font-bold text-sm">
                          Price: {product.price}
                        </p>
                        <button
                          aria-label={`Add ${product.name} to cart`}
                          className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] flex items-center justify-center hover:bg-[#0F9E59] hover:text-white transition-all duration-200"
                        >
                          <HiOutlineShoppingCart size={15} />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-gray-500 text-base font-medium">No products found</p>
            <button
              onClick={() => { setSearch(''); setActiveFilter('All Products'); setPage(1); }}
              className="mt-3 text-sm text-[#0F9E59] font-medium hover:underline"
            >
              Clear filters
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
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
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
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
