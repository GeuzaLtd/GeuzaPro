'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const PARTICLES = [
  { x: '12%', size: 6, delay: 0, duration: 5 },
  { x: '28%', size: 4, delay: 1.2, duration: 4.5 },
  { x: '45%', size: 8, delay: 0.5, duration: 6 },
  { x: '60%', size: 5, delay: 2, duration: 5.5 },
  { x: '74%', size: 4, delay: 0.8, duration: 4 },
  { x: '88%', size: 7, delay: 1.6, duration: 5 },
];

const headline = ['Your', 'Gift', 'Changes', 'Everything'];

export default function DonateHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/images/donate.jpg"
          alt="Donate to Geuza"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/85" />
      </div>

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-[#0F9E59]"
          style={{ left: p.x, width: p.size, height: p.size }}
          animate={{ y: [0, -300, -600], opacity: [0, 0.7, 0], scale: [0.4, 1, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#0F9E59]/20 border border-[#0F9E59]/50 rounded-full px-5 py-2 mb-10"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-[#0F9E59]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[#0F9E59] text-sm font-semibold tracking-widest uppercase">
            Make a Difference Today
          </span>
        </motion.div>

        {/* Staggered headline */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-7">
          {headline.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`font-display font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-none ${
                word === 'Changes' ? 'text-[#0F9E59]' : 'text-white'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12"
        >
          Every contribution funds the creation of affordable assistive devices from recycled
          e-waste, giving independence, dignity, and a second chance to those who need it most.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="relative inline-flex"
        >
          {/* Pulse rings */}
          {[1, 2].map((ring) => (
            <motion.span
              key={ring}
              className="absolute inset-0 rounded-full bg-[#0F9E59]"
              animate={{ scale: [1, 1.5 + ring * 0.4], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: ring * 0.5, ease: 'easeOut' }}
            />
          ))}
          <a
            href="#donate-form"
            className="relative inline-flex items-center gap-2.5 bg-[#0F9E59] text-white font-bold text-sm px-10 py-4 rounded-full hover:bg-[#0d8a4d] transition-colors duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Donate Now
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.4">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}
