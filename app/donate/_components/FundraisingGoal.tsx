'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const GOAL = 5_000_000;
const RAISED = 3_250_000;
const PERCENT = Math.round((RAISED / GOAL) * 100);
const DONORS = 147;

export default function FundraisingGoal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-14 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-[#0F9E59] text-xs font-bold tracking-[0.22em] uppercase mb-1">Monthly Campaign</p>
            <h2 className="font-display font-black text-gray-900 text-2xl md:text-3xl">
              Help Us Reach Our Goal
            </h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-black text-[#0F9E59]">
              {RAISED.toLocaleString()} Frw
            </p>
            <p className="text-sm text-gray-400">
              raised of <span className="font-semibold text-gray-600">{GOAL.toLocaleString()} Frw</span> goal
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0F9E59] to-[#1bc870] rounded-full relative"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${PERCENT}%` } : { width: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Shimmer */}
            <motion.span
              className="absolute inset-0 bg-white/30 rounded-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 1.8 }}
            />
          </motion.div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0F9E59] to-[#1bc870] border-2 border-white flex items-center justify-center"
                  style={{ opacity: 1 - i * 0.15 }}
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
              ))}
            </div>
            <span className="font-medium text-gray-700">{DONORS} donors</span>
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.8 }}
            className="font-bold text-[#0F9E59] text-lg"
          >
            {PERCENT}% funded
          </motion.span>
        </div>
      </div>
    </section>
  );
}
