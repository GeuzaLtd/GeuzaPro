'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { HiOutlineShoppingCart, HiCheck } from 'react-icons/hi2';
import { SectionHeader } from './ui';
import { useCart } from '@/lib/cart-context';

export interface ProductItem {
  id: number;
  name: string;
  inStock: boolean;
  image: string | null;
}

function ProductCard({ product }: { product: ProductItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock || added) return;
    addItem({ productId: product.id, name: product.name, image: product.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="flex-shrink-0 bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
      style={{ width: CARD_W }}
    >
      <div className="relative h-44 mb-4 bg-white rounded-xl overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            No image
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-semibold tracking-wider uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h3>
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`flex-shrink-0 p-2.5 rounded-xl shadow-sm border transition-all duration-200 ${
            added
              ? 'bg-primary text-white border-primary'
              : product.inStock
              ? 'bg-white text-gray-600 border-gray-100 hover:bg-primary hover:text-white hover:border-primary'
              : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
          }`}
          aria-label="Add to cart"
        >
          {added ? <HiCheck size={18} /> : <HiOutlineShoppingCart size={18} />}
        </button>
      </div>
    </div>
  );
}

const CARD_W = 256;  // px  (w-64)
const GAP    = 24;   // px  (gap-6)
const STEP   = CARD_W + GAP;
const SPEED  = 56;   // px / second  (leftward)

export default function Products({ products }: { products: ProductItem[] }) {
  const N          = products.length;
  const totalWidth = N * STEP;

  const x      = useMotionValue(0);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused.current || N === 0) return;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -totalWidth) next += totalWidth;
    x.set(next);
  });

  if (N === 0) return null;

  // Triple so there is always a buffer on both sides
  const loopedProducts = [...products, ...products, ...products];

  return (
    <section id="products" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-10">
          <SectionHeader title="Products" className="mb-0" />
          <Link
            href="/products"
            className="text-gray-500 hover:text-primary text-sm font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* Full-width carousel viewport with edge fade */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
        onMouseEnter={() => { paused.current = true;  }}
        onMouseLeave={() => { paused.current = false; }}
      >
        <motion.div
          className="flex py-2"
          style={{ x, width: 'max-content', gap: GAP }}
        >
          {loopedProducts.map((product, i) => (
            <ProductCard key={`${product.id}-${i}`} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
