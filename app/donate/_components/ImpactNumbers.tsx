'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const stats = [
  {
    end: 847,
    suffix: '+',
    label: 'Devices Donated',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M2 17h3M19 17h3" />
      </svg>
    ),
  },
  {
    end: 1200,
    suffix: '+',
    label: 'Lives Changed',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    end: 6,
    suffix: '',
    label: 'Districts Reached',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    end: 3,
    suffix: ' Yrs',
    label: 'Years of Impact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

function CountUp({ end, suffix, delay }: { end: number; suffix: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(0, end, {
      duration: 2,
      delay,
      ease: 'easeOut',
      onUpdate(v) { setDisplay(Math.round(v).toLocaleString() + suffix); },
    });
    return () => ctrl.stop();
  }, [isInView, end, suffix, delay]);

  return <span ref={ref}>{display}</span>;
}

export default function ImpactNumbers() {
  return (
    <section className="py-16 md:py-20 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase mb-3">
            Our Reach So Far
          </p>
          <h2 className="font-display font-black text-white text-3xl md:text-4xl">
            Small Donations. Enormous Impact.
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 hover:border-[#0F9E59]/30 transition-all duration-300 group"
            >
              <div className="text-[#0F9E59] mb-4 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <p className="font-display font-black text-white text-4xl md:text-5xl mb-2">
                <CountUp end={s.end} suffix={s.suffix} delay={i * 0.12} />
              </p>
              <p className="text-white/50 text-sm font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
