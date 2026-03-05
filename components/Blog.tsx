import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader, Button } from './ui';

export default function Blog() {
  return (
    <section id="blog" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="Blog" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image
              src="/images/blog-image.png"
              alt="Children with disabilities playing"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Empowering People with Disabilities: Building an Inclusive Society for All
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              People with disabilities are an essential part of our society, yet they often face barriers that limit their full participation in everyday life. These challenges may appear in education, employment, transportation, healthcare, and access to digital services. True inclusion goes beyond sympathy or charity—it requires intentional design, supportive policies, and a shift in mindset that recognizes ability rather than limitation. By listening to the voices of people with disabilities and involving them in decision-making.
            </p>
            <Link href="/blog">
              <Button>Read more</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
