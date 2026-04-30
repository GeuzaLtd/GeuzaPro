'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const heroImages = [
  { src: '/images/hero-image.png',              alt: 'Person using a wheelchair' },
  { src: '/images/hero-image2.png',             alt: 'Geuza assistive device' },
  { src: '/images/home/blind-spects.png',       alt: 'Vision assistive spectacles' },
  { src: '/images/home/leg-braces-bg.png',      alt: 'Leg braces' },
  { src: '/images/home/ACL-Knee-Brace-bg.png',  alt: 'ACL knee brace' },
  { src: '/images/home/grabber-device.png',     alt: 'Grabber assistive device' },
  { src: '/images/home/back-spinover-bg.png',   alt: 'Back support device' },
  { src: '/images/home/blind-stick-bg.png',     alt: 'Blind walking stick' },
  { src: '/images/home/blind-typing.png',       alt: 'Blind typing device' },
  { src: '/images/home/hearing-device-bg.png',  alt: 'Hearing assistive device' },
  { src: '/images/home/blind-device-bg1.png',   alt: 'Vision assistive device' },
  { src: '/images/home/hearing-device1-bg.png', alt: 'Hearing device' },
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
            <p className="text-secondary font-semibold mb-3 tracking-wide uppercase text-sm">
              Welcome to Geuza Africa
            </p>
            <p className="text-white/65 text-sm italic mb-5 tracking-wide">
              <span className="text-secondary not-italic font-semibold">&ldquo;Geuza&rdquo;</span>
              {' '} a Swahili word meaning{' '}
              <span className="text-secondary not-italic font-semibold">&ldquo;to transform&rdquo;</span>
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              Transforming E-Waste into Smart Assistive Devices
            </h1>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 bg-white text-primary font-bold px-7 py-3.5 rounded-full hover:bg-secondary hover:text-white transition-colors duration-300 group"
            >
              Order a Device
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
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
