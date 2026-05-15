'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { SectionHeader } from './ui';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string | null;
}

// Card size — large enough that ≤ 4 cards fit on any screen
const CARD_W  = 400;  // px  (≈ w-[300px])
const GAP     = 60;   // px  (gap-10)
const STEP    = CARD_W + GAP;  // 340 px per slot
const SPEED   = 48;   // px / second  (leftward)

export default function Team({ members }: { members: TeamMember[] }) {
  const N          = members.length;
  const totalWidth = N * STEP;

  const x      = useMotionValue(0);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused.current || N === 0) return;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -totalWidth) next += totalWidth;
    x.set(next);
  });

  if (N === 0) return null;

  // Triple so there's always a buffer on both sides
  const loopedMembers = [...members, ...members, ...members];

  return (
    <section id="team" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="LEADERSHIP TEAM" />
      </div>

      {/* Full-width carousel with edge fade */}
      <div
        className="overflow-hidden mt-2"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
        onMouseEnter={() => { paused.current = true;  }}
        onMouseLeave={() => { paused.current = false; }}
      >
        <motion.div
          className="flex py-4"
          style={{ x, width: 'max-content', gap: GAP }}
        >
          {loopedMembers.map((member, i) => (
            <div
              key={`${member.id}-${i}`}
              className="flex-shrink-0 text-center group"
              style={{ width: CARD_W }}
            >
              <div
                className="relative mb-4 rounded-2xl overflow-hidden bg-gray-200 mx-auto"
                style={{ width: CARD_W, height: CARD_W }}
              >
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl font-bold bg-gray-100">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-base leading-snug">
                {member.name}
              </h3>
              <p className="text-gray-500 text-sm mt-0.5">{member.role}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
