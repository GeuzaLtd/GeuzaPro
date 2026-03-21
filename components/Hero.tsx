'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const heroImages = [
  { src: '/images/hero-image.png', alt: 'Person in wheelchair with disco ball' },
  { src: '/images/hero-image2.png', alt: 'Geuza assistive device' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function Hero() {
  const [[activeIndex, direction], setSlide] = useState([0, 1]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSlide(([prev]) => [(prev + 1) % heroImages.length, 1]);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startTimer]);

  const next = () => {
    setSlide(([prev]) => [(prev + 1) % heroImages.length, 1]);
    startTimer();
  };

  const prev = () => {
    setSlide(([prev]) => [(prev - 1 + heroImages.length) % heroImages.length, -1]);
    startTimer();
  };

  return (
    <section className="bg-primary min-h-[600px] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white z-10">
            <p className="text-secondary font-semibold mb-4 tracking-wide">
              WELCOME TO GEUZA
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transforming E-Waste into Smart Assistive Devices
            </h1>
          </div>

          {/* Right Image Slideshow */}
          <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={heroImages[activeIndex].src}
                  alt={heroImages[activeIndex].alt}
                  fill
                  className="object-contain object-center"
                  priority={activeIndex === 0}
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
