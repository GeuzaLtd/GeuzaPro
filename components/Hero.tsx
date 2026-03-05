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
    <section className="bg-[#0F9E59] min-h-[600px] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white z-10">
            <p className="text-[#FF7900] font-semibold mb-4 tracking-wide">
              WELCOME TO GEUZA
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              We are Redefining smart assistive devices
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
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

            {/* Prev button */}
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setSlide(([prev]) => [i, i > prev ? 1 : -1]); startTimer(); }}
                  aria-label={`Go to image ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
