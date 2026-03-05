'use client';

import { motion } from 'framer-motion';

const reasons = [
  {
    title: 'Sustainable Materials',
    description:
      'Every device is crafted from responsibly repurposed electronic waste, turning discarded components into life-changing mobility aids.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
  {
    title: 'Direct Community Reach',
    description:
      '100% of device proceeds go directly to individuals in underserved communities across Rwanda who cannot afford commercial alternatives.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Lasting Independence',
    description:
      'A single assistive device doesn\'t just help someone move — it unlocks employment, education, and a life lived fully on their own terms.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function WhyDonate() {
  return (
    <section className="py-16 md:py-24 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase mb-3">Why Your Donation Matters</p>
          <h2 className="font-display font-black text-white text-3xl md:text-4xl">
            Built with Purpose.<br className="hidden md:block" /> Delivered with Care.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#0F9E59]/40 transition-all duration-400 overflow-hidden"
            >
              {/* Green glow on hover */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#0F9E59]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="text-[#0F9E59] mb-5 group-hover:scale-110 transition-transform duration-300">
                {r.icon}
              </div>

              <h3 className="font-display font-bold text-white text-xl mb-3">{r.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{r.description}</p>

              {/* Bottom accent */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#0F9E59]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
