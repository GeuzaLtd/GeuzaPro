'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavLink { name: string; href: string }
interface Props {
  navLinks: NavLink[];
  isLoggedIn: boolean;
}

export default function MobileMenu({ navLinks, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="md:hidden mt-4 pb-4 border-t pt-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/sign-in"
                  className="px-6 py-2 border-2 border-primary text-primary rounded-full font-medium text-center hover:bg-primary hover:text-white transition-all"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/donate"
                  className="px-6 py-2 bg-primary text-white rounded-full font-medium text-center hover:bg-primary-dark transition-all"
                  onClick={() => setOpen(false)}
                >
                  Donate
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <Link
                href="/donate"
                className="px-6 py-2 bg-primary text-white rounded-full font-medium text-center hover:bg-primary-dark transition-all"
                onClick={() => setOpen(false)}
              >
                Donate
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
