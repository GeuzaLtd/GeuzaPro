'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion } from 'framer-motion';

interface Partner {
  id:      number;
  name:    string;
  logo:    string | null;
  website: string | null;
}

export default function PartnersStrip({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;

  // Duplicate list so the marquee loops seamlessly
  const doubled = [...partners, ...partners];

  return (
    <section className="py-14 border-y border-gray-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-400 tracking-widest uppercase whitespace-nowrap">
          Trusted and Funded by
        </span>
        <span className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          className="flex items-center gap-16"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: partners.length * 4, ease: 'linear', repeat: Infinity }}
          style={{ width: 'max-content' }}
        >
          {doubled.map((partner, i) => (
            <PartnerLogo key={`${partner.id}-${i}`} partner={partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const content = partner.logo ? (
    <div className="relative h-10 w-36">
      <Image
        src={partner.logo}
        alt={partner.name}
        fill
        className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
        unoptimized
      />
    </div>
  ) : (
    <span className="text-lg font-bold text-gray-300 hover:text-gray-500 transition-colors whitespace-nowrap">
      {partner.name}
    </span>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        title={partner.name}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
      {content}
    </div>
  );
}
