'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { animate, useInView } from 'framer-motion';

const stats = [
  { end: 500, decimals: 0, suffix: '+', label: 'Devices Created' },
  { end: 65,  decimals: 0, suffix: '+', label: 'Lives Empowered' },
  { end: 2.5, decimals: 1, suffix: 'K', label: 'E-Waste Items'   },
  { end: 15,  decimals: 0, suffix: '',  label: 'Partners'         },
];

interface CountUpProps {
  end: number;
  decimals: number;
  suffix: string;
  delay: number;
}

function CountUp({ end, decimals, suffix, delay }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, end, {
      duration: 2,
      delay,
      ease: 'easeOut',
      onUpdate(value) {
        setDisplay(
          decimals > 0
            ? value.toFixed(decimals) + suffix
            : Math.round(value).toString() + suffix
        );
      },
    });

    return () => controls.stop();
  }, [isInView, end, decimals, suffix, delay]);

  return <span ref={ref}>{display}</span>;
}

export default function Impact() {
  return (
    <section className="relative py-20 md:py-28 bg-primary">
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <Image
          src="/images/impact-image.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-white text-lg md:text-xl font-bold tracking-[0.2em] uppercase mb-3">
            Our Impact So Far
          </h2>
          <div className="w-12 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-secondary text-4xl md:text-5xl font-bold mb-2">
                <CountUp
                  end={stat.end}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  delay={index * 0.15}
                />
              </p>
              <p className="text-white text-sm md:text-base opacity-90">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
