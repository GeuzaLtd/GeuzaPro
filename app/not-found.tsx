'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PARTICLES = [
  { x: '8%',  size: 5, delay: 0,   dur: 5   },
  { x: '22%', size: 3, delay: 1.2, dur: 4.5 },
  { x: '40%', size: 6, delay: 0.5, dur: 6   },
  { x: '60%', size: 4, delay: 1.8, dur: 5   },
  { x: '75%', size: 3, delay: 0.3, dur: 4   },
  { x: '90%', size: 5, delay: 1.0, dur: 5.5 },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-[#0F9E59]/30 pointer-events-none"
          style={{ left: p.x, width: p.size, height: p.size }}
          animate={{ y: [0, -400, -800], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#0F9E59]/6 blur-3xl pointer-events-none" />

      {/* Top bar — logo */}
      <div className="relative z-10 px-8 md:px-16 py-6 flex-shrink-0">
        <Link href="/">
          <Image src="/images/logo.png" alt="Geuza" width={100} height={30} className="object-contain" />
        </Link>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 relative z-10">

        {/* Wheelchair icon — floating */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-3xl bg-[#0F9E59]/10 flex items-center justify-center"
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0F9E59"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="3.5" r="1.5" fill="#0F9E59" stroke="none" />
              <path d="M12 6v4.5l2.5 2.5" />
              <path d="M9.5 9.5H13" />
              <circle cx="9.5" cy="17.5" r="2.5" />
              <path d="M12 14.5h3.5l1 3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring', bounce: 0.3 }}
          className="mb-5"
        >
          <p
            className="font-black text-gray-100 leading-none select-none text-center"
            style={{ fontSize: 'clamp(100px, 20vw, 200px)', letterSpacing: '-0.04em' }}
          >
            404
          </p>
        </motion.div>

        {/* Badge + text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-center max-w-sm -mt-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#0F9E59]/10 rounded-full px-3 py-1.5 mb-5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#0F9E59]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[#0F9E59] text-xs font-bold tracking-widest uppercase">Page Not Found</span>
          </div>

          <h1 className="font-display font-black text-gray-900 text-3xl md:text-4xl mb-3 leading-tight">
            Looks like this path<br />leads nowhere.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            The page you&apos;re looking for may have been moved, renamed, or doesn&apos;t exist.
            Let&apos;s get you back on track.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-8 py-3 rounded-full bg-[#0F9E59] text-white font-bold text-sm hover:bg-[#0d8a4d] transition-colors shadow-lg shadow-[#0F9E59]/20"
            >
              Go Home
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-[#0F9E59] hover:text-[#0F9E59] transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-5 flex-shrink-0">
        <p className="text-xs text-gray-300">&copy; {new Date().getFullYear()} Geuza. All rights reserved.</p>
      </div>

    </div>
  );
}
