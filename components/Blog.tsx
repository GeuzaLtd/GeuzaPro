import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader, Button } from './ui';

export interface LatestPost {
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  slug: string;
}

export default function Blog({ latestPost }: { latestPost: LatestPost | null }) {
  const title    = latestPost?.title    ?? 'Empowering People with Disabilities: Building an Inclusive Society for All';
  const excerpt  = latestPost?.excerpt  ?? 'People with disabilities are an essential part of our society, yet they often face barriers that limit their full participation in everyday life. True inclusion goes beyond sympathy or charity—it requires intentional design, supportive policies, and a shift in mindset that recognizes ability rather than limitation.';
  const image    = latestPost?.coverImage ?? '/images/blog-image.png';
  const href     = latestPost ? `/blog/${latestPost.slug}` : '/blog';

  return (
    <section id="blog" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <SectionHeader title="Blog" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>

          {/* Content */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-6">
              {excerpt}
            </p>
            <Link href={href}>
              <Button>Read more</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
