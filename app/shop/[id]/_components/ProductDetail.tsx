'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, cartItemKey } from '@/lib/cart-context';
import type { CartItem } from '@/lib/cart-context';
import { MdLock, MdPhone, MdRecycling } from 'react-icons/md';

interface ProductImage { id: number; url: string; isPrimary: boolean; }
interface Category { id: number; name: string; }

interface Product {
  id:          number;
  name:        string;
  description: string | null;
  stock:       number;
  status:      string;
  sizes:       string[];
  colors:      string[];
  minOrder:    number;
  images:      ProductImage[];
  categories:  Category[];
}

const COLOR_SWATCHES: Record<string, string> = {
  white:  '#f9fafb',
  black:  '#111827',
  yellow: '#eab308',
  green:  '#22c55e',
  red:    '#ef4444',
};

const KNOWN_COLORS = new Set(Object.keys(COLOR_SWATCHES));

function colorSwatch(c: string): string {
  return COLOR_SWATCHES[c.toLowerCase()] ?? '#9ca3af';
}

export default function ProductDetail({ product }: { product: Product }) {
  const primaryIdx  = product.images.findIndex((i) => i.isPrimary);
  const [activeImg, setActiveImg] = useState(primaryIdx >= 0 ? primaryIdx : 0);
  const [selectedSize,  setSelectedSize]  = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [qty,  setQty]  = useState(product.minOrder || 1);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();

  const mainImage = product.images[activeImg] ?? product.images[0];
  const inStock   = product.status !== 'out_stock' && product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;

    const item: CartItem = {
      productId: product.id,
      name:      product.name,
      image:     mainImage?.url ?? null,
      quantity:  qty,
      size:      selectedSize,
      color:     selectedColor,
    };

    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10 md:py-14">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0F9E59] transition-colors">Home</Link>
        <span>›</span>
        <Link href="/shop" className="hover:text-[#0F9E59] transition-colors">Shop</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Gallery ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
            {mainImage ? (
              <Image
                key={mainImage.id}
                src={mainImage.url}
                alt={product.name}
                fill
                className="object-contain p-6"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}

            {/* Stock badge */}
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${
              inStock ? 'bg-[#0F9E59]/10 text-[#0F9E59]' : 'bg-red-50 text-red-500'
            }`}>
              {inStock
                ? product.status === 'low_stock' ? 'Low Stock' : 'In Stock'
                : 'Out of Stock'
              }
            </span>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    activeImg === idx
                      ? 'border-[#0F9E59] shadow-md shadow-[#0F9E59]/20'
                      : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Category + name */}
          <div>
            {product.categories.length > 0 && (
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary block mb-2">
                {product.categories.map(c => c.name).join(' · ')}
              </span>
            )}
            <h1 className="font-display font-black text-gray-900 text-3xl md:text-4xl leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Size{' '}
                {selectedSize && (
                  <span className="text-[#0F9E59] normal-case font-semibold tracking-normal">
                    — {selectedSize}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(selectedSize === s ? undefined : s)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150 ${
                      selectedSize === s
                        ? 'border-[#0F9E59] bg-[#0F9E59] text-white shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-[#0F9E59]/50 hover:text-[#0F9E59]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Colour{' '}
                {selectedColor && (
                  <span className="text-[#0F9E59] normal-case font-semibold tracking-normal">
                    — {selectedColor}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {[...new Set(product.colors)].filter((c) => KNOWN_COLORS.has(c.toLowerCase())).map((c) => {
                  const hex     = colorSwatch(c);
                  const isLight = ['white', 'beige', 'yellow', 'silver'].includes(c.toLowerCase());
                  return (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setSelectedColor(selectedColor === c ? undefined : c)}
                      className={`w-9 h-9 rounded-full border-4 transition-all duration-150 flex items-center justify-center ${
                        selectedColor === c
                          ? 'border-[#0F9E59] scale-110 shadow-md'
                          : isLight
                          ? 'border-gray-200 hover:border-gray-400'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      {selectedColor === c && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#374151' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(product.minOrder || 1, q - 1))}
                disabled={qty <= (product.minOrder || 1)}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <span className="w-12 text-center font-bold text-gray-900 text-lg tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {product.minOrder > 1 && (
                <span className="text-xs text-gray-400">Min. order: {product.minOrder}</span>
              )}
            </div>
          </div>

          {/* Add to cart CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 ${
                added
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                  : inStock
                  ? 'bg-[#0F9E59] text-white hover:bg-[#0d8a4d] shadow-lg shadow-[#0F9E59]/20 hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            <Link
              href="/cart"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border-2 border-[#0F9E59] text-[#0F9E59] text-sm font-bold hover:bg-[#0F9E59] hover:text-white transition-all duration-300"
            >
              View Cart
            </Link>
          </div>

          {/* Trust notes */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: <MdLock size={14} />, text: 'Secure order' },
              { icon: <MdPhone size={14} />, text: 'We contact you to confirm' },
              { icon: <MdRecycling size={14} />, text: 'Made from repurposed e-waste' },
            ].map((n) => (
              <span key={n.text} className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="text-[#0F9E59]">{n.icon}</span> {n.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
