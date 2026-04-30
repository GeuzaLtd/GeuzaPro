'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const IMAGES = [
  { src: '/images/home/ACL-Knee-Brace-bg.png',   alt: 'ACL knee brace' },
  { src: '/images/home/back-spinover-bg.png',     alt: 'Back support device' },
  { src: '/images/home/blind-device-bg1.png',     alt: 'Vision assistive device' },
  { src: '/images/home/blind-spects.png',         alt: 'Vision spectacles' },
  { src: '/images/home/blind-stick-bg.png',       alt: 'Blind walking stick' },
  { src: '/images/home/blind-typing.png',         alt: 'Blind typing device' },
  { src: '/images/home/grabber-device.png',       alt: 'Grabber device' },
  { src: '/images/home/hearing-device1-bg.png',   alt: 'Hearing device' },
  { src: '/images/home/hearing-device-bg.png',    alt: 'Hearing device' },
  { src: '/images/home/leg-braces-bg.png',        alt: 'Leg braces' },
];

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 0.6 },
  exit:    { opacity: 0 },
  transition: { duration: 1.2, ease: 'easeInOut' as const },
};

export default function CompanyHero() {
  // Left and right start at different offsets and advance at different intervals
  // so the two panels are never in sync.
  const [leftIdx,  setLeftIdx]  = useState(0);
  const [rightIdx, setRightIdx] = useState(Math.floor(IMAGES.length / 2));

  useEffect(() => {
    const t = setInterval(() => setLeftIdx((i) => (i + 1) % IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRightIdx((i) => (i + 1) % IMAGES.length), 7000);
    return () => clearInterval(t);
  }, []);

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
      <div className="absolute left-0 bottom-0 w-[18%] h-[85%] pointer-events-none">
        <AnimatePresence>
          <motion.div
            key={leftIdx}
            {...FADE}
            className="absolute inset-0"
          >
            <Image
              src={IMAGES[leftIdx].src}
              alt={IMAGES[leftIdx].alt}
              fill
              className="object-contain object-bottom"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right slideshow */}
      <div className="absolute right-0 bottom-0 w-[26%] h-[90%] pointer-events-none">
        <AnimatePresence>
          <motion.div
            key={rightIdx}
            {...FADE}
            className="absolute inset-0"
          >
            <Image
              src={IMAGES[rightIdx].src}
              alt={IMAGES[rightIdx].alt}
              fill
              className="object-contain object-bottom"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

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
