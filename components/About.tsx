'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { TbRecycle } from 'react-icons/tb';
import { HiOutlineUserGroup, HiOutlineLightBulb, HiChevronDown } from 'react-icons/hi2';
import { SectionHeader } from './ui';

const accordionItems = [
  {
    id: 'sustainability',
    icon: TbRecycle,
    title: 'Sustainability',
    content: 'We advance a circular innovation model that transforms electronic waste into high-quality, affordable assistive technologies, reducing environmental harm while expanding access to essential support solutions for people living with disabilities, injuries, aging-related conditions, and other long-term health needs.',
  },
  {
    id: 'inclusion',
    icon: HiOutlineUserGroup,
    title: 'Inclusion',
    content: 'GEUZA envisions a future where access to assistive technology is not a privilege but a universal standard, where innovation restores independence, circular solutions protect our planet, and no one is left behind in the progress of technology.',
  },
  {
    id: 'innovation',
    icon: HiOutlineLightBulb,
    title: 'Innovation',
    content: 'At the intersection of circular engineering and health technology, electronic waste is transformed into smart assistive devices powered by IoT sensors and intelligent data systems, unlocking new possibilities for rehabilitation, accessibility, and the future of assistive technology.',
  },
];

export default function About() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="About us" />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image — fixed position, unaffected by accordion */}
          <div className="relative h-[300px] md:h-[480px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/ewaste-image.png"
              alt="Recycling bins for e-waste"
              fill
              className="object-cover"
            />
            {/* Subtle green overlay badge */}
            <div className="absolute bottom-2 left-4 bg-primary text-white text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full shadow">
              Est. 2023
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Transforming E-Waste<br />into life-changing assistive technology.
            </h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              At GEUZA, we transform discarded electronics into smart, affordable assistive devices through circular innovation and advanced technology, expanding access to rehabilitation and disability support while giving e-waste a second life.
            </p>

            {/* Accordion */}
            <div className="space-y-3">
              {accordionItems.map((item) => {
                const Icon = item.icon;
                const isOpen = openItem === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl overflow-hidden border transition-colors duration-300 ${
                      isOpen
                        ? 'border-primary bg-white shadow-sm'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between px-4 py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300 ${
                            isOpen
                              ? 'bg-primary text-white'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <Icon size={18} />
                        </span>
                        <span className="font-semibold text-gray-900">{item.title}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-400 flex-shrink-0"
                      >
                        <HiChevronDown size={20} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 pt-1 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
                            {item.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <Link
              href="/company"
              className="mt-8 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-300"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
