'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type CompanyHeroImageProp = { url: string; alt: string };

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 0.6 },
  exit:    { opacity: 0 },
  transition: { duration: 1.2, ease: 'easeInOut' as const },
};

export default function CompanyHero({ images }: { images: CompanyHeroImageProp[] }) {
  const total = images.length;
  const [leftIdx,  setLeftIdx]  = useState(0);
  const [rightIdx, setRightIdx] = useState(Math.max(0, Math.floor(total / 2)));

  useEffect(() => {
    if (!total) return;
    const t = setInterval(() => setLeftIdx((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  useEffect(() => {
    if (!total) return;
    const t = setInterval(() => setRightIdx((i) => (i + 1) % total), 7000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <section className="relative bg-gray-900 min-h-[480px] md:min-h-[560px] flex items-center justify-center overflow-hidden">

      {/* Large GEUZA watermark */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display font-black text-[#0F9E59]/15 text-[22vw] leading-none tracking-tighter uppercase">
          GEUZA
        </span>
      </span>

      {/* Left slideshow */}
      {total > 0 && (
        <div className="absolute left-0 bottom-0 w-[18%] h-[85%] pointer-events-none">
          <AnimatePresence>
            <motion.div key={leftIdx} {...FADE} className="absolute inset-0">
              <Image
                src={images[leftIdx].url}
                alt={images[leftIdx].alt || 'Assistive device'}
                fill
                className="object-contain object-bottom"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Right slideshow */}
      {total > 0 && (
        <div className="absolute right-0 bottom-0 w-[26%] h-[90%] pointer-events-none">
          <AnimatePresence>
            <motion.div key={rightIdx} {...FADE} className="absolute inset-0">
              <Image
                src={images[rightIdx].url}
                alt={images[rightIdx].alt || 'Assistive device'}
                fill
                className="object-contain object-bottom"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Center content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <p className="text-[#FF7900] font-semibold tracking-[0.2em] uppercase text-sm mb-3">
          Old but still Gold
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
          Smart, Affordable, and<br />
          Sustainable Assistive Devices
        </h1>
        <span className="inline-block bg-[#0F9E59] text-white font-bold tracking-[0.18em] uppercase text-xs px-8 py-3 rounded-md">
          About Us
        </span>
      </div>
    </section>
  );
}
