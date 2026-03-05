import Image from 'next/image';
import Link from 'next/link';

export default function ProductsHero() {
  return (
    <section className="relative h-[280px] md:h-[360px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/images/hero.png"
          alt="Geuza mobility devices"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Dark + green-tinted overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Breadcrumb */}
        <p className="text-white/50 text-xs tracking-[0.25em] uppercase mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {' '}&rsaquo;{' '}
          <span className="text-white/80">Products</span>
        </p>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-[0.08em]">
          Products
        </h1>

        {/* Accent line */}
        <div className="w-14 h-1 bg-[#0F9E59] mx-auto mt-5 rounded-full" />
      </div>
    </section>
  );
}
