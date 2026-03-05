'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';
import { SectionHeader } from './ui';

// ─── Data ─────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: 'MUTABAZI John',
    role: 'CEO Enviroserve',
    image: '/images/testimonials/person1.png',
    rating: 5,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: 2,
    name: 'MUTABAZI John',
    role: 'CEO Enviroserve',
    image: '/images/testimonials/person2.png',
    rating: 5,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
  },
  {
    id: 3,
    name: 'MUTABAZI John',
    role: 'CEO Enviroserve',
    image: '/images/testimonials/person3.png',
    rating: 5,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE   = testimonials.length;                              // 3
const EXT    = [...testimonials, ...testimonials, ...testimonials]; // 9
const INIT   = BASE;                                             // start at middle copy index 3
const CARD_W = 300;
const GAP    = 28;
const STEP   = CARD_W + GAP;
const CARD_H = 420;
const SPRING = { type: 'spring' as const, stiffness: 200, damping: 32, mass: 1 };

// ─── Sub-components ───────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <HiStar key={i} size={14} className="text-[#FF7900]" />
      ))}
    </div>
  );
}

type Testimonial = (typeof testimonials)[0];

function SideCard({ t }: { t: Testimonial }) {
  return (
    <div className="h-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between select-none">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#0F9E59]/20">
            <Image src={t.image} alt={t.name} fill className="object-cover" unoptimized />
          </div>
          <Stars count={t.rating} />
        </div>
        <p className="text-[#0F9E59] text-4xl font-serif leading-none mb-1">"</p>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-5">{t.quote}</p>
      </div>
      <div className="border-t border-gray-100 pt-4 mt-4">
        <h4 className="font-display font-bold text-gray-900 text-sm">{t.name}</h4>
        <p className="text-[#0F9E59] text-xs font-medium mt-0.5">{t.role}</p>
      </div>
    </div>
  );
}

function CenterCard({ t }: { t: Testimonial }) {
  return (
    <div className="h-full relative rounded-2xl overflow-hidden shadow-2xl select-none">
      <Image src={t.image} alt={t.name} fill className="object-cover object-top" unoptimized priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <Stars count={t.rating} />
        <p className="text-sm italic opacity-90 my-3 leading-relaxed line-clamp-4">"{t.quote}"</p>
        <h4 className="font-display font-bold text-lg">{t.name}</h4>
        <p className="text-xs opacity-70 mt-0.5">{t.role}</p>
      </div>
    </div>
  );
}

// ─── Card wrapper — scale & opacity driven by motion value, not React state ───
// This is the key fix: useTransform updates synchronously with x.set(),
// so there is never a frame where position and visual weight are out of sync.
function CardWrapper({
  trackX,
  cardIndex,
  containerW,
  t,
  isCenter,
}: {
  trackX: MotionValue<number>;
  cardIndex: number;
  containerW: number;
  t: Testimonial;
  isCenter: boolean;
}) {
  const scale = useTransform(trackX, (xVal) => {
    if (!containerW) return 0.9;
    const cardMid = xVal + cardIndex * STEP + CARD_W / 2;
    const dist    = Math.abs(cardMid - containerW / 2);
    if (dist <= STEP * 0.5) return 1.12;
    if (dist <= STEP * 1.5) return 0.9 + (1.12 - 0.9) * (1 - (dist - STEP * 0.5) / STEP);
    return 0.8;
  });

  const opacity = useTransform(trackX, (xVal) => {
    if (!containerW) return 0;
    const cardMid = xVal + cardIndex * STEP + CARD_W / 2;
    const dist    = Math.abs(cardMid - containerW / 2);
    if (dist <= STEP)        return 1 - 0.25 * (dist / STEP);
    if (dist <= 2 * STEP)    return 0.75 - 0.35 * ((dist - STEP) / STEP);
    if (dist <= 2.8 * STEP)  return 0.4 * (1 - (dist - 2 * STEP) / (0.8 * STEP));
    return 0;
  });

  return (
    <motion.div
      style={{
        width:       CARD_W,
        height:      CARD_H,
        flexShrink:  0,
        marginRight: GAP,
        scale,
        opacity,
      }}
    >
      {isCenter ? <CenterCard t={t} /> : <SideCard t={t} />}
    </motion.div>
  );
}

// ─── Main carousel ────────────────────────────────────────────────────────────
export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [center, setCenter]         = useState(INIT);
  const [isMobile, setIsMobile]     = useState(false);

  const x        = useMotionValue(0);
  const isPaused = useRef(false);
  const animCtrl = useRef<AnimationPlaybackControls | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Measure container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setContainerW(el.offsetWidth));
    obs.observe(el);
    setContainerW(el.offsetWidth);
    return () => obs.disconnect();
  }, []);

  const getX = useCallback(
    (c: number) => containerW / 2 - CARD_W / 2 - c * STEP,
    [containerW],
  );

  // Initialise position
  useEffect(() => {
    if (containerW > 0) x.set(getX(INIT));
  }, [containerW, getX, x]);

  // ── Core slide function ────────────────────────────────────────────────────
  // The reset is done in onComplete — AFTER the spring fully lands.
  // x.set() is called first (sync motion value), setCenter immediately after
  // so both take effect before the next paint — no frame gap, no visible jump.
  const slideTo = useCallback(
    (newCenter: number) => {
      animCtrl.current?.stop();
      animCtrl.current = animate(x, getX(newCenter), {
        ...SPRING,
        onComplete() {
          let reset: number | null = null;
          if      (newCenter >= 2 * BASE) reset = newCenter - BASE;
          else if (newCenter <      BASE) reset = newCenter + BASE;

          if (reset !== null) {
            // x.set + setCenter called back-to-back: motion value is sync,
            // React batches the state update into the same commit → one paint.
            x.set(getX(reset));
            setCenter(reset);
          }
        },
      });
      setCenter(newCenter);
    },
    [x, getX],
  );

  const next = useCallback(() => slideTo(center + 1), [center, slideTo]);
  const prev = useCallback(() => slideTo(center - 1), [center, slideTo]);

  // Auto-slide
  useEffect(() => {
    const id = setInterval(
      () => { if (!isPaused.current) next(); },
      isMobile ? 5500 : 3500,
    );
    return () => clearInterval(id);
  }, [next, isMobile]);

  const activeDot = center % BASE;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="Testimonials" />
      </div>

      {/* Full-width carousel viewport */}
      <div
        ref={containerRef}
        className="relative py-12 overflow-hidden"
        onMouseEnter={() => { if (!isMobile) isPaused.current = true;  }}
        onMouseLeave={() => { if (!isMobile) isPaused.current = false; }}
      >
        <motion.div
          className="flex"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          dragConstraints={{ left: -100_000, right: 100_000 }}
          dragElastic={0}
          onDragStart={() => { isPaused.current = true; }}
          onDragEnd={(_, info) => {
            const threshold = CARD_W / 3;
            if      (info.offset.x < -threshold) next();
            else if (info.offset.x >  threshold) prev();
            else {
              animCtrl.current?.stop();
              animCtrl.current = animate(x, getX(center), SPRING);
            }
            setTimeout(() => { isPaused.current = false; }, 800);
          }}
        >
          {EXT.map((t, i) => (
            <CardWrapper
              key={i}
              trackX={x}
              cardIndex={i}
              containerW={containerW}
              t={t}
              isCenter={i === center}
            />
          ))}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => slideTo(INIT + (i - activeDot))}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeDot
                ? 'w-6 h-2.5 bg-[#0F9E59]'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
