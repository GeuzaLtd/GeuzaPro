'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'COMPANY', href: '/company' },
    { name: 'PRODUCTS', href: '/products' },
    { name: 'SHOP', href: '/shop' },
    { name: 'BLOG', href: '/blog' },
  ];

  return (
    <header className="bg-white py-4 px-4 md:px-8 lg:px-16 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Geuza Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-[#0F9E59] font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="px-6 py-2 border-2 border-[#0F9E59] text-[#0F9E59] rounded-full font-medium hover:bg-[#0F9E59] hover:text-white transition-all"
          >
            Sign in
          </Link>
          <Link
            href="/donate"
            className="px-6 py-2 bg-[#0F9E59] text-white rounded-full font-medium hover:bg-[#0d8a4d] transition-all"
          >
            Donate
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t pt-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-[#0F9E59] font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="#"
                className="px-6 py-2 border-2 border-[#0F9E59] text-[#0F9E59] rounded-full font-medium text-center hover:bg-[#0F9E59] hover:text-white transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/donate"
                className="px-6 py-2 bg-[#0F9E59] text-white rounded-full font-medium text-center hover:bg-[#0d8a4d] transition-all"
              >
                Donate
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
