'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function CartIcon() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} item${count !== 1 ? 's' : ''})`}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-[#0F9E59] hover:text-[#0F9E59] transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#0F9E59] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
