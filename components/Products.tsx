'use client';

import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimationControls } from 'framer-motion';
import { HiOutlineShoppingCart } from 'react-icons/hi2';
import { SectionHeader } from './ui';

const products = [
  {
    id: 1,
    name: 'Wheelchair',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/wheelchair.png',
  },
  {
    id: 2,
    name: 'Walking Crutches',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/crutches.png',
  },
  {
    id: 3,
    name: 'Underarm Crutches',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/underarm-crutches.png',
  },
  {
    id: 4,
    name: 'Walking Frame',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/walking-frame.png',
  },
  {
    id: 5,
    name: 'Walking Frame',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/walking-frame.png',
  },
  {
    id: 6,
    name: 'Walking Frame',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/walking-frame.png',
  },
];

// Duplicate for seamless loop: at x=-50% the visual is identical to x=0
const loopedProducts = [...products, ...products];

export default function Products() {
  const controls = useAnimationControls();

  const play = useCallback(() => {
    controls.start({
      x: '-50%',
      transition: {
        duration: 18,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      },
    });
  }, [controls]);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <section id="products" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-10">
          <SectionHeader title="Products" className="mb-0" />
          <Link
            href="#"
            className="text-gray-500 hover:text-[#0F9E59] text-sm font-medium transition-colors"
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
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() => play()}
      >
        <motion.div
          className="flex gap-6 px-6"
          animate={controls}
          initial={{ x: 0 }}
          style={{ width: 'max-content' }}
        >
          {loopedProducts.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="w-64 flex-shrink-0 bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-44 mb-4 bg-white rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Stock badge */}
                <span className="absolute top-2 left-2 text-[10px] font-semibold tracking-wider uppercase bg-[#0F9E59]/10 text-[#0F9E59] px-2 py-0.5 rounded-full">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Info */}
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-[#0F9E59] font-bold mt-1">{product.price}</p>
                </div>

                <button
                  className="flex-shrink-0 p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-[#0F9E59] hover:text-white hover:border-[#0F9E59] transition-all duration-200 text-gray-600"
                  aria-label="Add to cart"
                >
                  <HiOutlineShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
